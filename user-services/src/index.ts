import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import router from "./infrastructure/api/express/route/user.route.js";
import routerProfile from "./infrastructure/api/express/route/profile.route.js"
import { AppError } from "@domain/errors/AppError.js";
import RedisCache from "@infrastructure/service/cache/redis/client.cache.js";
import UserRepository from "@infrastructure/database/mongodb/user.dao.js";
import Consumer from "@infrastructure/service/message/consumer.message.js";
import Publisher from "@infrastructure/service/message/publisher.message.js";
import HandelEventRegisterUserCreate from "@application/event/register_createUser.event.js";
import hostConfig from "./config/host.config.js";
const app = express();
app.use(express.json());
app.use("/", router);
app.use("/profile",routerProfile)
app.use("/health", (req: Request, res: Response) => {
  res.json({ message: "ok" });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      name: err.name,
    });
  }

      console.log(err)
  res.status(500).json({
    code: "INTERNAL",
    message: "Lỗi server",
  });
});

async function bootstrap() {
  await RedisCache.getInstance().connect();
  const userRepository = new UserRepository();
  const consumer = await Consumer.create();
  const publisher = await Publisher.create();
  const consumerRegisterUserCreate = new HandelEventRegisterUserCreate(
    userRepository,
    consumer,
    publisher,
  );

  consumerRegisterUserCreate.execute();

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} Nhận thông tin, đã ngắt thông tin`);
    await RedisCache.getInstance().disconnect?.();
    consumer.close();
    publisher.close();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  app.listen(hostConfig.PORT||3002, () => {
    console.log(`Server đang chạy ở  ${hostConfig.HOST}:${hostConfig.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Khởi động thất bại:", err);
  process.exit(1);
});
