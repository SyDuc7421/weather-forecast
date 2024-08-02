require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import validateEnv from "./utils/validateEnv";
import { AppDataSource } from "./utils/data-source";
import redisClient from "./utils/connectRedis";
import cookieParser from "cookie-parser";
import cors from "cors";
import AppError from "./utils/appError";
import authRoute from "./routes/auth.routes";
import userRoute from "./routes/user.routes";

AppDataSource.initialize()
  .then(async () => {
    // Validate env
    validateEnv();

    const app = express();

    // Middleware
    app.use(
      express.json({
        limit: "10kb",
      })
    );

    app.use(cookieParser());

    app.use(
      cors({
        origin: config.get<string>("origin"),
        credentials: true,
      })
    );

    app.use("/api/auth", authRoute);
    app.use("/api/users", userRoute);

    // Health checker
    app.get("/api/healthchecker", async (req: Request, res: Response) => {
      const message = await redisClient.get("try");
      res.status(200).json({
        message,
      });
    });

    // Unhandle route
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // Global error handler
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>("port");
    app.listen(port);
    console.log(`Server started on port: ${port}`);
  })
  .catch((err: any) => console.log(err));
