import { Type } from "@sinclair/typebox";
import { z } from "zod";

export const typeboxSchema = Type.Object({
  name: Type.String({ minLength: 2, default: "Jane" }),
  nickname: Type.Optional(Type.String({ minLength: 2 })),
  age: Type.Number({ minimum: 13, errorMessage: "Must be a number >= 13" }),
  siblings: Type.Optional(Type.Integer({ minimum: 0 })),
  email: Type.String({
    pattern: "^[a-z]+@[a-z]+[.][a-z]+$",
    minLength: 10,
  }),
  agree: Type.Boolean(),
});

export const zodSchema = z.object({
  name: z.string().min(2, ">= 2 chars").default("Jane"),
  nickname: z.optional(z.string().min(2)),
  age: z
    .number()
    .min(13, ">= 13")
    .default("" as unknown as number),
  siblings: z.optional(z.number().int().min(0)),
  email: z.string().min(10).email(),
  agree: z.boolean(),
});
