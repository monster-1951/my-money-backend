import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string({
    error: "PORT is missing in environment variables",
  }),

  DATABASE_URL: z
    .string()
    .nonempty({ error: "DATABASE_URL is missing in environment variables" }),

  JWT_SECRET_KEY: z
    .string()
    .nonempty({ error: "JWT_SECRET_KEY is missing in environment variables" }),

  TOKEN_HEADER_KEY: z.string().nonempty({
    error: "TOKEN_HEADER_KEY is missing in environment variables",
  }),
  NODE_ENV:z.string().nonempty({
    error:"NODE_ENV is missing"
  })
});

export interface Env extends z.infer<typeof envSchema> {}




