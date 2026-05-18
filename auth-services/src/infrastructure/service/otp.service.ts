import crypto from "crypto";
import type IOtpService from "@domain/service/otp.service.js";
import { BusinessError, ValidationError } from "@domain/errors/AppError.js";
import { OtpErr } from "@domain/errors/otpError.js";
import type ICache from "@domain/cache/cache.entities.js";
export default class OTPService implements IOtpService {
  private LENGTH: number;
  private OTP_RETRY_TIME: number;
  private Redis:ICache

  constructor(Redis:ICache,Length: number = 6, otp_retry_time: number = 5) {
    this.LENGTH = Length;
    this.OTP_RETRY_TIME = otp_retry_time;
    this.Redis = Redis
  }

  public async generateOtp(email: string):Promise<string> {
      const number = Math.pow(10, this.LENGTH - 1);
      const otp = crypto.randomInt(0, number).toString().padStart(6, "0");
      const time = await this.Redis.get(`otp-created-at:${email}`) as string|null

      if(time && typeof time === 'string'){
        const cur = new Date()
        const redisTime = new Date(time)
        if(cur.getTime() - redisTime.getTime() < 30*1000){
            throw new BusinessError(`WAIT_30_SECONDS`)
        }
      }

      if(await this.Redis.get(`otp:${email}`)){
        await this.Redis.delete(`otp:${email}`)
        await this.Redis.delete(`otp-retry:${email}`)
        await this.Redis.delete(`otp-created-at:${email}`)
      }

      await this.Redis.set(`otp-retry:${email}`, 0);
      await this.Redis.set(`otp-created-at:${email}`,new Date().toString())
      await this.Redis.set(`otp:${email}`, otp, 300);
      return otp
  }

  public async verify(email: string, otp: string) {
    const otpRedis = await this.Redis.get(`otp:${email}`);
    const otpRetry = (await this.Redis.get(`otp-retry:${email}`)) as number;

    if(!otpRedis){
      throw OtpErr.expiredOtp()
    }

    if (otpRetry >= this.OTP_RETRY_TIME) {
      await this.Redis.delete(`otp:${email}`);
      await this.Redis.delete(`otp-retry:${email}`);
      throw OtpErr.maxAttemptsExceeded()
    }

    if (otpRedis !== otp) {
      await this.Redis.set(`otp-retry:${email}`, otpRetry + 1);
      throw OtpErr.invalidOtp()
    }

    await this.Redis.delete(`otp:${email}`);
    await this.Redis.delete(`otp-retry:${email}`);
  }
}
