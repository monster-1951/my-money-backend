import z from "zod";
import * as RecordSchemas from "../schemas/RecordSchema";
import { ServiceResponse } from "./StandardTypes";

type record_type = "Income" | "Expense" | "Transfer";

export interface IncomeExpenseRecord extends z.infer<typeof RecordSchemas.IncomeExpenseRecordSchema> {
  user_id:bigint
}

export interface TransferRecord extends z.infer<typeof RecordSchemas.TransferRecordSchema> {
    user_id:bigint
}

export interface Record {
  id: bigint;
  type: record_type;
  amount: number;
  account: bigint;
  time: Date;
  category: bigint | null;
  notes: string | null;
  user_id: bigint;
  transferred_to_account: bigint | null;
}

// PARAMS TYPES

export interface GetAllRecordsParams {
    user_id:bigint
}

export interface CreateRecordParams {
    type:record_type,
    amount:number,
    account:bigint,
    time:Date,
    category?:bigint,
    notes?:string,
    user_id:bigint,
    transferred_to_account?:bigint
}


export interface CreateIncomeExpenseRecordParams {
  type: record_type;
  amount: number;
  account_id: number;
  time: string;
  user_id: bigint;
  category_id: number;
  notes?: string;
}

export interface CreateTransferRecordParams extends TransferRecord {

}


// RESPONSE TYPES

export interface GetAllRecordsResponse extends ServiceResponse {
    Records?:Record[]
    TotalCount?:number
}

export interface CreateRecordResponse extends ServiceResponse {
  newRecord?: Record;
}
