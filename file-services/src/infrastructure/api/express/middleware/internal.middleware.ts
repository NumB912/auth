import type { NextFunction, Response ,Request} from "express";
export default function internalMiddleware(req:Request, res:Response, next:NextFunction) {
    const secretInternal = process.env.SECRET_INTERNAL;
    if(!secretInternal){
        return res.status(500).json({ error: "Lỗi trong quá trình thực hiện" });
    }

    if(secretInternal !== req.headers["x-secret-internal"]){
        return res.status(403).json({ error: "Không có quyền thao tác" });
    }
    next();
}