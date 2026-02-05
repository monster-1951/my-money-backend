import z from "zod";
import * as RecordSchemas from "../schemas/RecordSchema";
import * as StandardType  from "./StandardTypes";

export type record_type = "Income" | "Expense" | "Transfer";

export interface IncomeExpenseRecord extends z.infer<typeof RecordSchemas.IncomeExpenseRecordSchema> {
  user_id: bigint;
}

export interface TransferRecord extends z.infer<typeof RecordSchemas.TransferRecordSchema> {
  user_id: bigint;
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

export interface RecordQueryParamsType {
  id?: bigint;
  type?: record_type;
  amount_gte?:number
  amount_lt?:number
  account?: bigint;
  time_gte?:Date
  time_lt?:Date
  category?: bigint;
  transferred_to_account?: bigint;
}

export interface RecordFilters {
  id?: bigint;
  type?: record_type;
  amount?:{
    gte?:number,
    lt?:number
  }
  amount_lt?:number
  account?: bigint;
  time?:{
    gte?: Date
    lt?: Date
  }
  category?: bigint;
  transferred_to_account?: bigint;
}

// PARAMS TYPES

export interface GetAllRecordsParams {
  user_id: bigint;
  queryParams: RecordQueryParamsType;
}

export interface CreateRecordParams {
  type: record_type;
  amount: number;
  account: bigint;
  time: Date;
  category?: bigint;
  notes?: string;
  user_id: bigint;
  transferred_to_account?: bigint;
}

// RESPONSE TYPES

export interface GetAllRecordsResponse extends StandardType.ServiceResponse {
  Records?: Record[];
  TotalCount?: number;
}

export interface CreateRecordResponse extends StandardType.ServiceResponse {
  newRecord?: Record;
}
