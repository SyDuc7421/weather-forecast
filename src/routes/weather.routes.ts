import express from "express";
import { getWeather } from "../controllers/weather.controller";
import { validate } from "../middleware/validate";
import { getWeatherSchema } from "../schemas/weather.schema";

const router = express.Router();

router.get("/", validate(getWeatherSchema), getWeather);

export default router;
