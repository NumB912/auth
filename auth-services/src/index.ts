import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import { AppError } from "@domain/errors/AppError.js";
import RedisCache from "@infrastructure/service/cache/redis/client.cache.js";
import cookieParser from 'cookie-parser'
import router from "@infrastructure/api/express/route/internal.route.js";
import routerAuth from "@infrastructure/api/express/route/auth.route.js"
const app = express();
app.use(express.json());
app.use(cookieParser())
app.get('/health',(req,res)=>{
  res.status(200).json({status:'ok',message:'good'})
})

app.use("/", routerAuth);
app.use("/internal/auth",router)
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

async function bootstrap() {
  await RedisCache.getInstance().connect();
  app.listen(3001, () => {                 
    console.log("🚀 Server running on http://localhost:3001");
  });
}

bootstrap().catch((err) => {
  console.error("Khởi động thất bại:", err);
  process.exit(1);
});