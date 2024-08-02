import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: Object,
  keyName: "accessTokenKey" | "refreshTokenKey",
  options: SignOptions
) => {
  const key = config.get<string>(keyName);
  return jwt.sign(payload, key, { ...options, algorithm: "HS256" });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenKey" | "refreshTokenKey"
): T | null => {
  try {
    const key = config.get<string>(keyName);
    const decoded = jwt.verify(token, key) as T;

    return decoded;
  } catch (err: any) {
    return null;
  }
};
