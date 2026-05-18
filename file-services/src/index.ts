import FileService from "@infrastructure/service/file/file.service.js";
import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import upload from "@infrastructure/service/multer/multer.service.js";
import internalMiddleware from "@infrastructure/api/express/middleware/internal.middleware.js";
import { AppError } from "@domain/errors/AppError.js";
import asyncHandler from "@infrastructure/api/express/middleware/asyncHandler.middleware.js";
const app = express();
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "/public/uploads")),
);

app.post(
  "/file",
  internalMiddleware,
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {

    res.json({ message: "Tải file thành công",url:req.file?.filename });
  }),
);

app.delete(
  "/file",
  express.json(),
  internalMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;
    const fileService = new FileService();
    await fileService.removeFile(url);
    res.json({ message: "Xóa file thành công" });
  }),
);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("=== Global Handler ===");
  console.log("constructor.name:", err.constructor.name);
  console.log("instanceof AppError:", err instanceof AppError);
  console.log("message:", err.message);
  console.log("message:", err.stack);
  console.log("=====================");
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      name: err.name,
    });
  }

  res.status(500).json({
    code: "INTERNAL",
    message: "Lỗi server",
  });
});

app.listen(3008, () => {
  console.log("Server is running on port 3008 http://localhost:3008");
});
