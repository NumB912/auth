import { BusinessError, ValidationError } from "@domain/errors/AppError.js";
import TokenService from "@infrastructure/service/token.service.js";
import type { NextFunction, Request, Response } from "express";

export default function tokenHeaderMiddleware(tokenHeader: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers[tokenHeader] as string;
    if (!token) {
      throw new ValidationError(["Token register không tồn tại"]);
    }

    try {
      const data = await new TokenService().verifyToken(token);
      req.body = { ...req.body, ...data };
      next();
    } catch (error) {
      console.error("[token] Hết hạn Vui lòng thao tác lại");
      throw new BusinessError("Hết hạn phiên thao tác vui lòng thử lại");
    }
  };
}
