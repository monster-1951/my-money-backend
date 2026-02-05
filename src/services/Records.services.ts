import { sanitizeId } from "../lib/helper";
import { prisma } from "../lib/prisma";
import * as RecordServiceTypes from "../types/RecordServiceTypes";

const RECORDS = prisma.records;

export const GetAll = async (
  params: RecordServiceTypes.GetAllRecordsParams,
): Promise<RecordServiceTypes.GetAllRecordsResponse> => {
  try {
    const Records = await RECORDS.findMany({
      where: {
        user_id: params.user_id,
      },
    });
    if (Records.length)
      console.log(Records)
      return {
        message: "Fetched Records Successfully",
        statusCode: 200,
        Records,
        TotalCount:Records.length
      };
    return { message: "No Records found", statusCode: 404 };
  } catch (error) {
    return { message: "Failed to fetch Records", statusCode: 500 };
  }
};

export const Create = async (
  data: RecordServiceTypes.CreateRecordParams,
): Promise<RecordServiceTypes.CreateRecordResponse> => {
  try {
    const newRecord = await RECORDS.create({ data });
    return {
      message: "Record created Successfully",
      statusCode: 200,
      newRecord,
    };
  } catch (error) {
    return { message: "Failed to create Record", statusCode: 500, error };
  }
};

export const sanitizeDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const CreateIncomeExpenseRecord = async (
  params: RecordServiceTypes.CreateIncomeExpenseRecordParams,
): Promise<RecordServiceTypes.CreateRecordResponse> => {
  const data: RecordServiceTypes.CreateRecordParams = {
    type: params.type,
    amount: params.amount,
    account: sanitizeId(params.account_id),
    time: sanitizeDate(params.time),
    user_id: params.user_id,
    category: sanitizeId(params.category_id),
    notes: params.notes,
  };
  try {
    const response = await Create(data);
    return response;
  } catch (error) {
    return { message: "Failed to create Record", statusCode: 500, error };
  }
};

export const CreateTransferRecord = async (
  params: RecordServiceTypes.CreateTransferRecordParams,
): Promise<RecordServiceTypes.CreateRecordResponse> => {
  const data: RecordServiceTypes.CreateRecordParams = {
    account: sanitizeId(params.account_id),
    amount: params.amount,
    time: sanitizeDate(params.time),
    type: params.type,
    user_id: params.user_id,
    transferred_to_account: sanitizeId(params.transferred_to_account_id),
  };
  try {
    const response = await Create(data);
    return response;
  } catch (error) {
    return { message: "Failed to create Record", statusCode: 500, error };
  }
};
