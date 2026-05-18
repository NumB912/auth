import { AppError } from "@domain/errors/AppError.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { url } = req.body;
    
    if (!file) {
      return cb(new AppError("NOT_FOUND_FILE", "Không tìm thấy file", 404), "");
    }

    if (!url) {
      return cb(new AppError("NOT_FOUND_URL", "Không tìm thấy url", 404), "");
    }

    if (!fs.existsSync(path.join(process.cwd(), "public/uploads", url))) {
      fs.mkdirSync(path.join(process.cwd(), "public/uploads", url), {
        recursive: true,
      });
    }
    cb(null, path.join(process.cwd(), "public/uploads", url));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + `${crypto.randomUUID()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError("INVALID_FILE_TYPE", "Chỉ chấp nhận file hình ảnh (jpg, png, gif, webp)", 400) as unknown as null, false);
    }
    cb(null, true);
  },
});

export default upload;