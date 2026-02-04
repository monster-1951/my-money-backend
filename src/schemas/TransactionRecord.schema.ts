import {z} from 'zod'

export const TransactionRecordSchema = z.object({
    ACCOUNT: z.string().min(3),
    TIME: z.string(),
    TYPE : z.enum(["(+) Income" , "(-) Expense" , "(.) Transfer"]),
    AMOUNT : z.number(),
    CATEGORY: z.string(),
    NOTES: z.string()
})

export interface TransactionRecord extends z.infer<typeof TransactionRecordSchema> {}
