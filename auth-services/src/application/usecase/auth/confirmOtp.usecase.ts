import type ICache from "@domain/cache/cache.entities.js";
import { BusinessError } from "@domain/errors/AppError.js";
import type IOtpService from "@domain/service/otp.service.js";
import type ITokenService from "@domain/service/token.service.js";
import type IUsecase from "@domain/usecase/usecase.entities.js";

export default class ConfirmOtpUsecase implements IUsecase<string> {
  private otpService: IOtpService;
  private TokenService:ITokenService
  private RedisService:ICache
  constructor(
    otpService: IOtpService,
    TokenService:ITokenService,
    RedisService:ICache
  ) {
    this.otpService = otpService;
    this.TokenService = TokenService
    this.RedisService = RedisService
  }

  async execute(email: string,otp:string): Promise<string> {

   await this.otpService.verify(email,otp)

   const token = await this.TokenService.generateToken({email:email},"7m")

  if(!token){
    throw new BusinessError('TOKEN_IS_NOT_EXIST')
  }

   await this.RedisService.set(`register:${email}`,token,60*7)

   return token
  }
}
