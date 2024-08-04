import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
    JWT_ACCESS_TOKEN_KEY: str(),
    JWT_REFRESH_TOKEN_KEY: str(),

    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    EMAIL_FROM: str(),
    EMAIL_HOST: str(),
    EMAIL_PORT: port(),

    WEATHER_API_KEY: str(),

    REDIS_HOST: str(),

    FRONT_END_BASE_URL: str(),
  });
};

export default validateEnv;
