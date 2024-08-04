import dotenv from "dotenv";

dotenv.config();

export default {
  port: "PORT",

  postgresConfig: {
    host: "POSTGRES_HOST",
    port: "POSTGRES_PORT",
    username: "POSTGRES_USER",
    password: "POSTGRES_PASSWORD",
    database: "POSTGRES_DB",
  },

  accessTokenKey: "JWT_ACCESS_TOKEN_KEY",
  refreshTokenKey: "JWT_REFRESH_TOKEN_KEY",

  smtp: {
    host: "EMAIL_HOST",
    pass: "EMAIL_PASS",
    port: "EMAIL_PORT",
    user: "EMAIL_USER",
  },

  redisConfig: {
    host: "REDIS_HOST",
  },

  key: "WEATHER_API_KEY",
};
