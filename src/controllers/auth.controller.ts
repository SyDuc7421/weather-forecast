import config from "config";

import { CookieOptions, Request, Response, NextFunction } from "express";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
  signTokens,
} from "../services/user.service";
import { User } from "../entities/user.entity";
import AppError from "../utils/appError";
import { signJwt, verifyJwt } from "../middleware/jwt";
import redisClient from "../utils/connectRedis";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

// Cookie secure
if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUser({
      name,
      email: email.toLocaleLowerCase(),
      password,
    });

    res.status(201).json({
      status: "success",
      data: { user },
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with that email already exist",
      });
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail({ email });

    if (!user || !(await User.comparePassword(password, user.password))) {
      return next(new AppError(400, "Invalid email or password"));
    }

    const { access_token, refresh_token } = await signTokens(user);

    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = "Could not refresh access token";

    if (!refresh_token) {
      return next(new AppError(403, message));
    }

    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      "refreshTokenKey"
    );
    if (!decoded) {
      return next(new AppError(403, message));
    }

    const session = await redisClient.get(decoded.sub);
    if (!session) {
      return next(new AppError(403, message));
    }

    const user = await findUserById(JSON.parse(session).id);
    if (!user) {
      return next(new AppError(403, message));
    }

    const access_token = signJwt({ sub: user.id }, "accessTokenKey", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie("access_token", "", { maxAge: -1 });
  res.cookie("refresh_token", "", { maxAge: -1 });
  res.cookie("logged_in", "", { maxAge: -1 });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    await redisClient.del(user.id);
    logout(res);

    res.status(200).json({
      status: "success",
    });
  } catch (err: any) {
    next(err);
  }
};
