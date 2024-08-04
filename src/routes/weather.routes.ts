import express from "express";
import { getWeather, historyWeather } from "../controllers/weather.controller";
import { validate } from "../middleware/validate";
import { getWeatherSchema } from "../schemas/weather.schema";

const router = express.Router();
// search API
router.get("/", validate(getWeatherSchema), getWeather);

// get History
router.get("/history", historyWeather);

export default router;
