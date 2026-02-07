import lodash from "lodash";
import * as RecordType from "../types/RecordServiceTypes";
import { Decimal } from "@prisma/client/runtime/client";

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

export const sanitizeId = (id: any) => {
  if (lodash.isArray(id)) return BigInt(id[0]);
  return BigInt(id);
};

export const checkForSameValue = async (
  category: any,
  columnName: any,
  value: any,
) => {
  return category[columnName] === value;
};

export const sanitizeDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const TypeCastRecordFilters = (
  RouteQueryParams: RecordType.RecordQueryParamsType,
): RecordType.RecordFilters => {
  return {
    filters: {
      account: RouteQueryParams.account && BigInt(RouteQueryParams.account),

      amount: {
        gte:
          RouteQueryParams.amount_gte && Decimal(RouteQueryParams.amount_gte),
        lt: RouteQueryParams.amount_lt && Decimal(RouteQueryParams.amount_lt),
      },

      category: RouteQueryParams.category && BigInt(RouteQueryParams.category),

      id: RouteQueryParams.id && BigInt(RouteQueryParams.id),

      time: {
        gte: RouteQueryParams.time_gte && new Date(RouteQueryParams.time_gte),
        lt: RouteQueryParams.time_lt && new Date(RouteQueryParams.time_lt),
      },

      type:
        RouteQueryParams.type &&
        (RouteQueryParams.type as RecordType.record_type),
    },
    page: RouteQueryParams.page && (Number(RouteQueryParams.page) - 1) * 10,
  };
};

export const SanitizeCreateRecordParams = (
  params: any,
  user_id: bigint,
): RecordType.CreateRecordParams => {
  return {
    type: params.type,
    amount: params.amount,
    account: sanitizeId(params.account_id),
    time: sanitizeDate(params.time),
    user_id: user_id,
    category: sanitizeId(params.category_id),
    notes: params.notes,
    transferred_to_account: null,
  };
};

export const SanitizeCreateTransferRecordParams = (
  params: any,
  user_id: bigint,
) => {
  return {
    account: sanitizeId(params.account_id),
    amount: params.amount,
    time: sanitizeDate(params.time),
    transferred_to_account: sanitizeId(params.transferred_to_account_id),
    type: params.type,
    user_id: user_id,
    category: null,
  };
};

export const SanitizeUpdateRecordParams = (
  params: any,
  id: string | string[],
  user_id: bigint,
): RecordType.UpdateRecordParams => {
  return {
    id: sanitizeId(id),
    user_id: user_id,
    data: {
      type: params.type,
      amount: params.amount,
      account: params.account_id && sanitizeId(params.account_id),
      time: params.time && sanitizeDate(params.time),
      category: params.category_id && sanitizeId(params.category_id),
      notes: params.notes,
      transferred_to_account: null,
    },
  };
};

export const SanitizeUpdateTransferRecordParams = (
  params: any,
  id: string | string[],
  user_id: bigint,
): RecordType.UpdateRecordParams => {
  return {
    id: sanitizeId(id),
    user_id: user_id,
    data: {
      account: params.account_id && sanitizeId(params.account_id),
      amount: params.amount,
      time: params.time && sanitizeDate(params.time),
      transferred_to_account:
        params.transferred_to_account_id &&
        sanitizeId(params.transferred_to_account_id),
      type: params.type || "Transfer",
      category: null,
    },
  };
};
