import cron from "node-cron";
import { findUserSubcribe } from "../services/user.service";
import config from "config";
import { locationProps, weatherProps } from "../types/weather.type";
import Email from "./email";
export const Scheduler = () => {
  // // Schedule to send email at 8:00 AM every day
  cron.schedule("0 8 * * *", async () => {
    const key = config.get<string>("key");
    const redirectUrl = config.get<string>("origin");
    const users = await findUserSubcribe();

    for (const user of users) {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?q=${user.subcribe}&key=${key}`
      );
      const forecast = await response.json();

      const data: {
        location: locationProps;
        current: weatherProps;
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
      };

      console.log("Send intify to email: " + user.email);
      await new Email(
        user,
        redirectUrl,
        JSON.stringify(data.current)
      ).sendWeatherToday();
    }
  });
};
