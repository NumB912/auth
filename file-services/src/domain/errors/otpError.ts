import { BusinessError } from "./AppError.js"

export class OtpErr extends BusinessError{

    constructor( message: string) {
        super(message);
    }

    static invalidOtp(){
        return new OtpErr("OTP_ERROR")
    }

    static expiredOtp(){
        return new OtpErr("OTP_EXPRIRED")
    }

    static maxAttemptsExceeded(){
        return new OtpErr("OTP_MAX_ATTEMPTS")
    }

}