import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies['token']
    if (!token) {
      return res.status(401).json({ code:"TOKEN_MISSING",message: "Không xác thực được" });
    }
    console.log('token')
    const data = jwt.verify(token, process.env.SECRET_KEY as string);
    req.user = data as JwtPayload;
    next();
  } catch (error) {
    console.error('[Authentication] - Lỗi xác thực', error)
    return res.status(401).json({ code:"TOKEN_EXPIRED", message: "Token hết hạn" });
  }
}



export default auth;
