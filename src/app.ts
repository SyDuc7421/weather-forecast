require("dotenv").config();
import express, { Request, Response } from "express";
import config from "config";
import validateEnv from "./utils/validateEnv";
import { AppDataSource } from "./utils/data-source";
import redisClient from "./utils/connectRedis";

AppDataSource.initialize()
  .then(async () => {
    // Validate env
    validateEnv();

    const app = express();

    // Middleware

    // Health checker
    app.get("/api/healthchecker", async (req: Request, res: Response) => {
      const message = await redisClient.get("try");
      res.status(200).json({
        message,
      });
    });

    // Unhandle route

    // Gloval error handler

    const port = config.get<number>("port");
    app.listen(port);
    console.log(`Server started on port: ${port}`);
  })
  .catch((err: any) => console.log(err));
