import { object, string, TypeOf, z } from "zod";

export const getWeatherSchema = object({
  query: object({
    position: string({
      required_error: "Position is required",
    }).min(3, "Position must be more than 3 characters"),

    days: z
      .string()
      .regex(/^\d+$/, "Days must be an integer")
      .transform(Number)
      .refine((val) => val >= 1 && val <= 14, "Days must be between 1 and 14")
      .default("1")
      .transform(Number),
  }),
});

export type GetWeatherInput = TypeOf<typeof getWeatherSchema>["query"];
