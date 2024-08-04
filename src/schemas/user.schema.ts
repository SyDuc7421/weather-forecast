import { number, object, string, TypeOf, z } from "zod";
import { RoleEnumType } from "../entities/user.entity";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),

    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),

    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),

    role: z.optional(z.nativeEnum(RoleEnumType)),
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),

    password: string({
      required_error: "Password is required",
    })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
  }),
});

export const verifyEmailSchema = object({
  params: object({
    verificationCode: string(),
  }),
});

export const subcribeSchema = object({
  params: object({
    subcribePosition: string(),
  }),
});

export type SubcribeInput = TypeOf<typeof subcribeSchema>["params"];
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>["params"];
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
