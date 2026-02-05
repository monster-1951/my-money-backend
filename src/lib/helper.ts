import lodash from "lodash";
import * as RecordType from "../types/RecordServiceTypes";

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

export const sanitizeId = (id: any) => {
  if (lodash.isArray(id)) return BigInt(id[0]);
  return BigInt(id);
};

export const checkForSameValue = async ( category: any, columnName: any, value: any, ) => {
  return category[columnName] === value;
};

export const sanitizeDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const TypeCastRecordFilters = (RouteQueryParams: RecordType.RecordQueryParamsType): RecordType.RecordFilters => {

  return {
    account: RouteQueryParams.account && BigInt(RouteQueryParams.account),

    amount: {
      gte: RouteQueryParams.amount_gte && Number(RouteQueryParams.amount_gte),
      lt: RouteQueryParams.amount_lt && Number(RouteQueryParams.amount_lt),
    },

    category: RouteQueryParams.category && BigInt(RouteQueryParams.category),

    id: RouteQueryParams.id && BigInt(RouteQueryParams.id),

    time: {
      gte: RouteQueryParams.time_gte && new Date(RouteQueryParams.time_gte),
      lt: RouteQueryParams.time_lt && new Date(RouteQueryParams.time_lt),
    },

    type: RouteQueryParams.type && (RouteQueryParams.type as RecordType.record_type),
  };
};

export const SanitizeCreateRecordParams = (params:any,user_id:bigint):RecordType.CreateRecordParams => {
  return {
    type: params.type,
    amount: params.amount,
    account: sanitizeId(params.account_id),
    time: sanitizeDate(params.time),
    user_id: user_id,
    category: sanitizeId(params.category_id),
    notes: params.notes,
  }
}

export const SanitizeCreateTransferRecordParams = (params:any,user_id:bigint) => {
  return {
    account: sanitizeId(params.account_id),
    amount: params.amount,
    time: sanitizeDate(params.time),
    transferred_to_account: sanitizeId(params.transferred_to_account_id),
    type: params.type,
    user_id: user_id,
  }
}