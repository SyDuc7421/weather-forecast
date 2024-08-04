import express from "express";
import {
  getMeHandler,
  subcribeNotify,
  unSubcribeNotify,
} from "../controllers/user.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import { subcribeSchema } from "../schemas/user.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get("/me", getMeHandler);

// Subcribe weather notify
router.get(
  "/subcribe/:subcribePosition",
  validate(subcribeSchema),
  subcribeNotify
);

// Subcribe weather notify
router.get("/unsubcribe", unSubcribeNotify);

export default router;
