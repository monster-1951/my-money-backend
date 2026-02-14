import { z } from "zod";

export const AccountSchema = z.object({
  name: z.string(),
  balance: z.number(),
  icon: z.number(),
});

export const AccountModifySchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional(),
  icon: z.number().optional(),
});

export interface AccountInput extends z.infer<typeof AccountSchema> {}
