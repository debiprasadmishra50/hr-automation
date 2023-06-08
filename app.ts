import { join } from "path";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xssClean from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";

import AppError from "./src/utils/appError";
import globalErrorHandler from "./src/controller/errorController";

import router from "./src/routes/router";

const app = express();

app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));

if (process.env.NODE_ENV === "DEV") {
  app.use(morgan("dev"));
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", "https://*.cloudflare.com", "http://localhost:8000/"],
        baseUri: ["'self'"],
        scriptSrc: [
          "self",
          "http://localhost:8000/",
          "http://127.0.0.1:8000/",
          "https://*.cloudflare.com",
          "https://polyfill.io",
        ],
        styleSrc: ["self", "https:", "http:", "unsafe-inline"],
        imgSrc: ["'self'", "data:", "blob:"],
        fontSrc: ["'self'", "https:", "data:"],
        childSrc: ["'self'", "blob:"],
        styleSrcAttr: ["'self'", "unsafe-inline", "http:"],
        frameSrc: ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);

const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 1000,
  headers: true,
});
app.use("/api", limiter);

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(xssClean());

app.use(hpp());

app.use((req: Request | any, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1", router);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

app.use(globalErrorHandler);

export default app;
