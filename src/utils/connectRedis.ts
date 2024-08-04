import { createClient } from "redis";
import config from "config";

const REDIS_HOST = config.get<{ host: string }>("redisConfig");

const redisUrl = `redis://${REDIS_HOST.host}:6379`;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connected successfully");
    redisClient.set("try", "Heath OK");
  } catch (error) {
    console.log(error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
