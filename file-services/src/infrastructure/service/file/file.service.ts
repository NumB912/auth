import { AppError } from "@domain/errors/AppError.js";
import type IFile from "@domain/service/file.domain.js";
import fs from "fs";
import path from "path";
export default class FileService implements IFile {
  async uploadFile(file: File, url: string): Promise<string> {
    if (!file) {
      throw new AppError("NOT_FOUND_FILE", "Không tìm thấy file", 404);
    }
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(url, "uploads", file.name);

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    await fs.promises.writeFile(filePath, fileBuffer);
    return "https://example.com/file.jpg";
  }
  async removeFile(fileUrl: string): Promise<void> {
    if (!fileUrl) {
      throw new AppError("NOT_FOUND_FILE_URL", "Không tìm thấy fileUrl", 404);
    }
    const filePath = path.join(process.cwd(), "public/uploads", fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new AppError("FILE_NOT_FOUND", "Không tìm thấy file để xóa", 404);
    }
  }
}
