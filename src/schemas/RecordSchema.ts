import { z } from "zod";


export const IncomeExpenseRecordSchema = z.object({
  type: z.enum(["Income", "Expense"]),
  amount: z.number(),
  account_id: z.number(),
  time: z.iso.datetime({offset:true}),
  category_id:z.number(),
  notes: z.string().optional()
});

export const TransferRecordSchema = IncomeExpenseRecordSchema.extend({
  type: z.enum(["Transfer"]),
  transferred_to_account_id: z.number(),
  category_id:z.number().optional()
});

