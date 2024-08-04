import { Request, Response, NextFunction } from "express";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import { locationProps, weatherProps } from "../types/weather.type";

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const subcribeNotify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subcribePosition = req.params.subcribePosition;

    const currentUser = await findUserById(res.locals.user.id);
    if (!currentUser) {
      return next(new AppError(400, "User not found"));
    }

    currentUser.subcribe = subcribePosition;
    await currentUser.save();

    res.status(200).json({
      status: "success",
      data: {
        user: currentUser,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const unSubcribeNotify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = await findUserById(res.locals.user.id);
    if (!currentUser) {
      return next(new AppError(400, "User not found"));
    }
    currentUser.subcribe = null;
    await currentUser.save();

    res.status(200).json({
      status: "success",
      data: {
        user: currentUser,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
