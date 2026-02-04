import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string(),
  category_type: z.string(),
});

export const CategoryModifySchema = z.object({
  name: z.string().optional(),
  category_type: z.string().optional(),
});
