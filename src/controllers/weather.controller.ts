import { Request, Response, NextFunction } from "express";
import { GetWeatherInput } from "../schemas/weather.schema";
import config from "config";
import AppError from "../utils/appError";
import {
  avarageWeatherProps,
  locationProps,
  weatherProps,
} from "../types/weather.type";
import redisClient from "../utils/connectRedis";

export const getWeather = async (
  req: Request<{}, GetWeatherInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { position, days = 1 } = req.query;
    const key = config.get<string>("key");

    const params = new URLSearchParams();
    params.append("q", position?.toString() || "Ho Chi Minh");
    params.append("days", days.toString() || "1");
    params.append("key", key);

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?${params.toString()}`
    );

    if (!response.ok) {
      return next(new AppError(400, "Faile to fetch forecast"));
    }
    const forecast = await response.json();

    const filteredData: {
      location: locationProps;
      current: weatherProps;
      forecast: {
        forecastday: avarageWeatherProps[];
      };
    } = {
      location: {
        name: forecast.location.name,
        country: forecast.location.country,
        localtime: forecast.location.localtime,
      },
      current: {
        time: forecast.current.last_updated,
        temp_c: forecast.current.temp_c,
        is_day: forecast.current.is_day,
        wind_kph: forecast.current.wind_kph,
        wind_dir: forecast.current.wind_dir,
        pressure_mb: forecast.current.pressure_mb,
        humidity: forecast.current.humidity,
        cloud: forecast.current.cloud,
        condition: {
          text: forecast.current.condition.text,
          icon: forecast.current.condition.icon,
          code: forecast.current.condition.code,
        },
        uv: forecast.current.uv,
      },
      forecast: {
        forecastday: forecast.forecast.forecastday.map((day: any) => ({
          date: day.date,
          maxtemp_c: day.day.maxtemp_c,
          mintemp_c: day.day.mintemp_c,
          avgtemp_c: day.day.avgtemp_c,
          totalprecip_mm: day.day.totalprecip_mm,
          avghumidity: day.day.avghumidity,
          daily_chance_of_rain: day.day.daily_chance_of_rain,
          uv: day.day.uv,
          condition: {
            text: day.day.condition.text,
            icon: day.day.condition.icon,
            code: day.day.condition.code,
          },
        })),
      },
    };

    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const ttl = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);
    // Store temp data for history
    redisClient.set("weather_history", JSON.stringify(filteredData), {
      EX: ttl,
    });

    res.status(200).json({
      status: "success",
      forecast: filteredData,
    });
  } catch (err: any) {
    next(err);
  }
};

export const historyWeather = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const history = await redisClient.get("weather_history");
    if (!history) {
      return next(new AppError(400, "History not found"));
    }
    const forecast = JSON.parse(history);

    res.status(200).json({
      status: "success",
      forecast,
    });
  } catch (err: any) {
    next(err);
  }
};
