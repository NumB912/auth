import { BusinessError, ValidationError } from "@domain/errors/AppError.js";
import TokenService from "@infrastructure/service/token.service.js";
import type { NextFunction, Request, Response } from "express";

export async function identityMiddleware(req: Request, res: Response, next: NextFunction) {
  const data = req.headers['x-user'] as string;
  console.log(data)
  try {
    if(!data){
      throw new ValidationError(['Không tồn tại data'])
    }
    req.user = JSON.parse(data)
    next();
  } catch (error) {
    console.error("Lỗi Key hết hạn vui lòng đăng nhập");
    throw new BusinessError(
      "Lỗi không tồn tại hoặc key đã hết hạn vui lòng đăng nhập",
    );
  }
}
