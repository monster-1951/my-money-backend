import { z } from "zod";

export const IncomeExpenseRecordSchema = z
  .object({
    type: z.enum(["Income", "Expense"]),
    amount: z.number(),
    account_id: z.number(),
    time: z.iso.datetime({ offset: true }),
    category_id: z.number(),
    notes: z.string().optional(),
    transferred_to_account_id: z.null().optional(),
  })
  .strict();

export const TransferRecordSchema = IncomeExpenseRecordSchema.omit({
  category_id: true,
})
  .extend({
    type: z.enum(["Transfer"]),
    transferred_to_account_id: z.number(),
    category_id: z.null().optional(),
  })
  .refine((d) => d.account_id !== d.transferred_to_account_id, {
    message: "You can't transfer to same account !",
    path: ["account_id", "transferred_to_account_id"],
  });

export const ModifyIncomeExpenseRecordSchema = IncomeExpenseRecordSchema.extend(
  {
    type: z.enum(["Income", "Expense"]).optional(),
    amount: z.number().optional(),
    account_id: z.number().optional(),
    time: z.iso.datetime({ offset: true }).optional(),
    category_id: z.number().optional(),
    notes: z.string().optional().optional(),
  },
);

export const ModifyTransferRecordSchema = ModifyIncomeExpenseRecordSchema.omit({
  category_id: true,
})
  .extend({
    type: z.enum(["Transfer"]).optional(),
    transferred_to_account_id: z.number().optional(),
  })