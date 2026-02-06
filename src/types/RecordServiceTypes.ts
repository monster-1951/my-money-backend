import z from "zod";
import * as RecordSchemas from "../schemas/RecordSchema";
import * as StandardType from "./StandardTypes";
import { Account } from "./AccountServiceTypes";


export type record_type = "Income" | "Expense" | "Transfer";

export interface IncomeExpenseRecord extends z.infer<
  typeof RecordSchemas.IncomeExpenseRecordSchema
> {
  user_id: bigint;
}

export interface TransferRecord extends z.infer<
  typeof RecordSchemas.TransferRecordSchema
> {
  user_id: bigint;
}

export interface Record {
  id: bigint;
  type: record_type;
  amount: StandardType.money;
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
  amount_gte?: StandardType.money;
  amount_lt?: StandardType.money;
  account?: bigint;
  time_gte?: Date;
  time_lt?: Date;
  category?: bigint;
  transferred_to_account?: bigint;
  page?: number;
}

export interface RecordFilters {
  filters: {
    id?: bigint;
    type?: record_type;
    amount?: {
      gte?: StandardType.money;
      lt?: StandardType.money;
    };
    amount_lt?: StandardType.money;
    account?: bigint;
    time?: {
      gte?: Date;
      lt?: Date;
    };
    category?: bigint;
    transferred_to_account?: bigint;
  };
  page?: number;
}

export interface RecordDataToModify {
  type: record_type;
  amount: StandardType.money;
  account: bigint;
  transferred_to_account: bigint | null;
  time: Date;
  category: bigint | null;
  notes?: string;
}
// PARAMS TYPES

export interface GetAllRecordsParams {
  user_id: bigint;
  queryParams: RecordFilters
}

export interface CreateRecordParams {
  type: record_type;
  amount: StandardType.money;
  account: bigint;
  time: Date;
  category: bigint | null;
  notes?: string;
  user_id: bigint;
  transferred_to_account: bigint | null;
}

export interface UpdateRecordParams {
  id: bigint;
  data: RecordDataToModify;
  user_id: bigint;
}

export interface DeleteRecordParams {
  id: bigint;
}

// RESPONSE TYPES

export interface GetAllRecordsResponse extends StandardType.ServiceResponse {
  Records?: Record[];
  TotalCount?: number;
}

export interface CreateRecordResponse extends StandardType.ServiceResponse {
  newRecord?: Record;
  from_account_balance?:StandardType.money
  to_account_balance?:StandardType.money
  type:record_type
}

export interface UpdateRecordResponse extends StandardType.ServiceResponse {
  UpdatedRecord?: Record;
  from_account_balance?:StandardType.money
  to_account_balance?:StandardType.money
  type:record_type
}

export interface DeleteRecordResponse extends StandardType.ServiceResponse {
  deletedRecord?: Record;
}
