import AuthController from "@adapter/controller/auth.controller.js";
import ConfirmOtpUsecase from "@application/usecase/auth/confirmOtp.usecase.js";
import RegisterEmailUsecase from "@application/usecase/auth/register.usecase.js";
import SendOtpUsecase from "@application/usecase/auth/sendOtp.usecase.js";
import type { IRequest } from "@domain/request/request.entities.js";
import OTPService from "@infrastructure/service/otp.service.js";
import TokenService from "@infrastructure/service/token.service.js";
import express, { type Request, type Response } from "express";
import validate from "../middleware/validate.middleware.js";
import sendOtpValidate from "@infrastructure/service/validate/zod/auth/sendOtp.validate.js";
import confirmOtpValidate from "@infrastructure/service/validate/zod/auth/confirmOtp.validate.js";
import registerWithEmailValidate from "@infrastructure/service/validate/zod/auth/registerWithEmail.validate.js";
import HashService from "@infrastructure/service/hash.service.js";
import Publisher from "@infrastructure/service/message/publisher.message.js";
import UUID from "@infrastructure/service/uuid.service.js";
import CredentialDao from "@infrastructure/database/mongodb/credential.dao.js";
import asyncHandler from "@infrastructure/error/asyncHandler.error.js";
import HttpClient from "@infrastructure/http/axio/axio.http.js";
import LoginWithEmailUseCase from "@application/usecase/auth/loginWithEmail.usecase.js";
import RefreshTokenUseCase from "@application/usecase/auth/refreshToken.usecase.js";
import { BusinessError } from "@domain/errors/AppError.js";
import SendChangePasswordUsecase from "@application/usecase/auth/sendChangePassword.usecase.js";
import RedisCache from "@infrastructure/service/cache/redis/client.cache.js";
import ChangePasswordUsecase from "@application/usecase/auth/changePassword.usecase.js";
import changePassValidate from "@infrastructure/service/validate/zod/auth/changePass.validate.js";
import tokenHeaderMiddleware from "../middleware/tokenHeader.middleware.js";
import LogoutUsecase from "@application/usecase/auth/logout.usecase.js";

const router = express.Router();
const redis = RedisCache.getInstance();
const tokenService = new TokenService();
const otpService = new OTPService(redis);
const hashService = new HashService();
const publisher = await Publisher.create();
const http = new HttpClient("http://service-3002:3002");
const uuidService = new UUID();
const repositoryCredential = new CredentialDao();

const sendChangePasswordUC = new SendChangePasswordUsecase(
  publisher,
  tokenService,
  redis,
  uuidService,
);
const refreshTokenUC = new RefreshTokenUseCase(redis, tokenService, http);
const confirmOtpUC = new ConfirmOtpUsecase(otpService, tokenService, redis);
const RegisterWithEmailUC = new RegisterEmailUsecase(
  repositoryCredential,
  hashService,
  uuidService,
  http,
);
const SendOtpUC = new SendOtpUsecase(
  publisher,
  otpService,
  repositoryCredential,
);

const LoginWithEmailUC = new LoginWithEmailUseCase(
  repositoryCredential,
  hashService,
  tokenService,
  http,
  redis,
);

const changePasswordUC = new ChangePasswordUsecase(
  repositoryCredential,
  tokenService,
  hashService,
  redis,
);

const logoutUC = new LogoutUsecase(
tokenService,
redis
)

const controller = new AuthController(
  confirmOtpUC,
  SendOtpUC,
  RegisterWithEmailUC,
  LoginWithEmailUC,
  refreshTokenUC,
  sendChangePasswordUC,
  changePasswordUC,
  logoutUC
);

router.post(
  "/send-otp",
  validate(sendOtpValidate),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    await controller.sendOtp({
      body: body,
    } as IRequest);
    res.status(200).json({ message: "Đã gửi thành công otp" });
  }),
);



router.post(
  "/registerWithEmail",
  tokenHeaderMiddleware("x-register-token"),
  validate(registerWithEmailValidate),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const register = await controller.registerWithEmail({
      body: body,
    } as IRequest);

    res.status(200).json({ register: register, message: "đăng ký thành công" });
  }),
);
router.post(
  "/refresh-token",
  asyncHandler(async (req: Request, res: Response) => {
    const refresh_token = req.cookies.refresh_token as string;
    if (!refresh_token) {
      throw new BusinessError("NOT FOUND REFRESH TOKEN");
    }
    const { token } = await controller.refreshToken({
      token: refresh_token,
    } as IRequest);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 1000 * 15,
      path: "/",
    });

    res.status(200).json({
      message: "thành công",
      token: token,
    });
  }),
);



router.post(
  "/send-change-pass",
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    await controller.sendChangePassword({
      body: body,
    } as IRequest);

    res.status(200).json({
      message: "Đã gửi email thành công vui lòng kiểm tra email",
    });
  }),
);

router.post(
  "/change-password",
  tokenHeaderMiddleware("x-change-password-token"),
  validate(changePassValidate),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;

    await controller.changePassword({
      body: body,
    } as IRequest);

    res.status(200).json({
      message: "Đổi mật khẩu thành công",
    });
  }),
);

router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies['token']
    const refresh_token = req.cookies['refresh_token']

    const reqI = {
        token:token,
        refresh_token:refresh_token
    }

    const result = controller.logout({
      body:reqI
    } as IRequest)

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1000,
      path: "/",
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 1000 * 15,
      path: "/",
    });

    res.status(200).json({
      message: "thành công",
    });
  }),
);

router.post(
  "/loginWithEmail",
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const { token, refresh_token } = await controller.loginWithEmail({
      body: body,
    } as IRequest);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1000,
      path: "/",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 1000 * 15,
      path: "/",
    });

    res.status(200).json({
      message: "thành công",
      token: token,
    });
  }),
);

router.post(
  "/confirm-otp",
  validate(confirmOtpValidate),
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const confirmOtp = await controller.confirmOtp({
      body: body,
    } as IRequest);
    res
      .status(200)
      .json({ message: "xác thực otp thành công", token: confirmOtp });
  }),
);

export default router;
