import { Request, Response, NextFunction } from "express";
import { GetWeatherInput } from "../schemas/weather.schema";
import config from "config";
import AppError from "../utils/appError";
import {
  avarageWeatherProps,
  locationProps,
  weatherProps,
} from "../types/weather.type";

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

    console.log(
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
        time: forecast.current.last_update,
        temp_c: forecast.current.last_update,
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
    res.status(200).json({
      filteredData,
    });
  } catch (err: any) {
    next(err);
  }
};
