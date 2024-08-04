import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";
import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";

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
    const currentUser = await findUserById(res.locals.user.id);
    if (!currentUser) {
      return next(new AppError(400, "User not found"));
    }
    currentUser.subcribe = true;
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
    currentUser.subcribe = false;
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
