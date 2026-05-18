import "dotenv/config";
import auth from "@infrastructure/middleware/authentication.js";
import logger from "@infrastructure/middleware/logger.js";
import ratelimiter from "@infrastructure/middleware/rate-limit.js";
import express, { type Request } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import cookieParser from 'cookie-parser'
import { ServiceConfig } from "@infrastructure/config/host_port.config.js";
const app = express();
app.use(
  cors({
    origin:  ServiceConfig.SERVICE_FRONT_END_URL,
    credentials: true,
  }),
);

app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "good" });
});

app.use(
  "/api/v1/user",
  logger,
  ratelimiter,
  auth,
  createProxyMiddleware({
    target:ServiceConfig.SERVICE_USER_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/v1/user": "" },
    on: {
      proxyReq: (proxyReq, req) => {
        const user = (req as Request).user;
        if (user) {
          proxyReq.setHeader("x-user", JSON.stringify(user));
        }
      },
    },
  }),
);

app.use(
  "/api/v1/auth",
  logger,
  ratelimiter,
  createProxyMiddleware({
    target: ServiceConfig.SERVICE_AUTH_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "" },
    cookieDomainRewrite: "localhost",
    on: {
      proxyRes: (proxyRes) => {
        const cookies = proxyRes.headers["set-cookie"];
        if (cookies) {
          proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
            cookie
              .replace(/;\s*Secure/gi, "")
              .replace(/;\s*SameSite=None/gi, "")
              .concat("; SameSite=Lax"),
          );
        }
      },
    },
  }),
);

app.use( "/photo",
  ratelimiter,
  createProxyMiddleware({
    target: ServiceConfig.SERVICE_PHOTO_URL,
    changeOrigin: true,
    pathRewrite: { "^/photo": "" },
    cookieDomainRewrite: "localhost",
  }))

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
