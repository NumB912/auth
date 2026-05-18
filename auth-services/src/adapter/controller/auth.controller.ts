import type ChangePasswordUsecase from "@application/usecase/auth/changePassword.usecase.js";
import type ConfirmOtpUsecase from "@application/usecase/auth/confirmOtp.usecase.js";
import LoginWithEmailUseCase from "@application/usecase/auth/loginWithEmail.usecase.js";
import type LogoutUsecase from "@application/usecase/auth/logout.usecase.js";
import type RefreshTokenUseCase from "@application/usecase/auth/refreshToken.usecase.js";
import RegisterEmailUsecase from "@application/usecase/auth/register.usecase.js";
import type SendChangePasswordUsecase from "@application/usecase/auth/sendChangePassword.usecase.js";
import type SendChangePassword from "@application/usecase/auth/sendChangePassword.usecase.js";
import type SendOtpUsecase from "@application/usecase/auth/sendOtp.usecase.js";
import type { IRequest } from "@domain/request/request.entities.js";

export default class AuthController {
  private confirmOtpEmailUsecase: ConfirmOtpUsecase;
  private sendOtpUsecase: SendOtpUsecase;
  private registerEmailUsecase: RegisterEmailUsecase;
  private loginWithEmailUsecase: LoginWithEmailUseCase;
  private refreshTokenUsecase: RefreshTokenUseCase;
  private sendChangePasswordUseCase: SendChangePassword;
  private changePasswordUsecase: ChangePasswordUsecase;
  private logoutUsecase:LogoutUsecase;

  constructor(
    confirmOtpEmailUsecase: ConfirmOtpUsecase,
    sendOtpUsecase: SendOtpUsecase,
    registerEmailUsecase: RegisterEmailUsecase,
    loginWithEmailUsecase: LoginWithEmailUseCase,
    refreshTokenUsecase: RefreshTokenUseCase,
    sendChangePasswordUseCase: SendChangePasswordUsecase,
    changePasswordUsecase: ChangePasswordUsecase,
    logoutUsecase:LogoutUsecase
  ) {
    this.confirmOtpEmailUsecase = confirmOtpEmailUsecase;
    this.sendOtpUsecase = sendOtpUsecase;
    this.registerEmailUsecase = registerEmailUsecase;
    this.loginWithEmailUsecase = loginWithEmailUsecase;
    this.refreshTokenUsecase = refreshTokenUsecase;
    this.sendChangePasswordUseCase = sendChangePasswordUseCase;
    this.changePasswordUsecase = changePasswordUsecase;
    this.logoutUsecase = logoutUsecase
  }

  async sendOtp(req: IRequest) {
    const { email } = req.body as { email: string };
    await this.sendOtpUsecase.execute(email);
  }

  async confirmOtp(req: IRequest) {
    const { email, otp } = req.body as { email: string; otp: string };
    return await this.confirmOtpEmailUsecase.execute(email, otp);
  }

  async registerWithEmail(req: IRequest) {
    const { firstName, lastName, password, email } = req.body as {
      firstName: string;
      lastName: string;
      password: string;
      email: string;
    };

    await this.registerEmailUsecase.execute({
      email:email,
      firstName:firstName,
      lastName:lastName,
      password:password,
    });
  }

  async logout(req:IRequest){
    const { token, refresh_token } = req.body as { token: string; refresh_token: string };

    const result = await this.logoutUsecase.execute({refresh_token:refresh_token,token:token})

    return result;
  }

  async loginWithEmail(req: IRequest) {
    const { email, password } = req.body as { email: string; password: string };

    const { token, refresh_token } = await this.loginWithEmailUsecase.execute({
      email,
      password,
    });

    return { token, refresh_token };
  }

  async refreshToken(req: IRequest) {
    const refresh_token = req.token as string;
    const token = await this.refreshTokenUsecase.execute(refresh_token);
    return token;
  }

  async changePassword(req: IRequest) {
    const { email, password } = req.body as { email: string; password: string };
    await this.changePasswordUsecase.execute({
      password: password,
      email: email,
    });
  }

  async sendChangePassword(req: IRequest) {
    const { email } = req.body as { email: string };
    await this.sendChangePasswordUseCase.execute(email);
  }
}
