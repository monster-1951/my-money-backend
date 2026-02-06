import { record_type } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import * as RecordServiceTypes from "../types/RecordServiceTypes";

const RECORDS = prisma.records;
const ACCOUNTS = prisma.accounts;
export const GetRecords = async (
  params: RecordServiceTypes.GetAllRecordsParams,
): Promise<RecordServiceTypes.GetAllRecordsResponse> => {
  console.log(params.queryParams);
  try {
    const Records = await RECORDS.findMany({
      where: {
        user_id: params.user_id,
        AND: params.queryParams.filters,
      },
      skip: params.queryParams.page || 0,
      take: 10,
    });
    if (Records.length)
      return {
        message: "Fetched Records Successfully",
        statusCode: 200,
        TotalCount: Records.length,
        Records,
      };
    return { message: "No Records found", statusCode: 404 };
  } catch (error) {
    return { message: "Failed to fetch Records", statusCode: 500, error };
  }
};

export const CreateTransaction = async (
  data: RecordServiceTypes.CreateRecordParams,
): Promise<RecordServiceTypes.CreateRecordResponse> => {
  if (data.type === "Transfer") {
    const [
      newRecord,
      { balance: from_account_balance },
      { balance: to_account_balance },
    ] = await prisma.$transaction([
      RECORDS.create({ data }),
      ACCOUNTS.update({
        where: { id: data.account },
        data: {
          balance: {
            decrement: data.amount,
          },
        },
      }),

      ACCOUNTS.update({
        where: { id: data.transferred_to_account as bigint },
        data: {
          balance: {
            increment: data.amount,
          },
        },
      }),
    ]);
    return {
      message: "Record Added Successfully",
      type: "Transfer",
      newRecord,
      from_account_balance,
      to_account_balance,
      statusCode: 200,
    };
  } else if (data.type === "Expense") {
    const [newRecord, { balance: from_account_balance }] =
      await prisma.$transaction([
        RECORDS.create({ data }),
        ACCOUNTS.update({
          where: { id: data.account },
          data: {
            balance: {
              decrement: data.amount,
            },
          },
        }),
      ]);
    return {
      message: "Record Added Successfully",
      type: "Expense",
      newRecord,
      from_account_balance,
      statusCode: 200,
    };
  } else {
    const [newRecord, { balance: to_account_balance }] =
      await prisma.$transaction([
        RECORDS.create({ data }),
        ACCOUNTS.update({
          where: { id: data.account },
          data: {
            balance: {
              increment: data.amount,
            },
          },
        }),
      ]);
    return {
      message: "Record Added Successfully",
      type: "Income",
      newRecord,
      to_account_balance,
      statusCode: 200,
    };
  }
};

export const Create = async (
  data: RecordServiceTypes.CreateRecordParams,
): Promise<RecordServiceTypes.CreateRecordResponse> => {
  try {
    const response = await CreateTransaction(data);
    return response;
  } catch (error) {
    return {
      message: "Failed to create Record",
      statusCode: 500,
      error,
      type: data.type,
    };
  }
};

export const UpdateTransaction = async (
  existingRecord: RecordServiceTypes.Record,
  params: RecordServiceTypes.UpdateRecordParams,
):Promise<RecordServiceTypes.UpdateRecordResponse> => {
  const delta = Number(existingRecord.amount) - Number(params.data.amount);
  //  0 0
  if (existingRecord.type === "Transfer" && params.data.type === "Transfer"  ) {
    if (
      existingRecord.account === params.data.account &&
      existingRecord.transferred_to_account ===
        params.data.transferred_to_account
    ) {
      console.log("Delta", delta)
      const [
        UpdatedRecord,
        { balance: from_account_balance },
        { balance: to_account_balance },
      ] = await prisma.$transaction([
        RECORDS.update({ where: { id: params.id }, data: params.data }),
        ACCOUNTS.update({
          where: { id: existingRecord.account },
          data: {
            balance: {
              increment: delta,
            },
          },
        }),

        ACCOUNTS.update({
          where: { id: existingRecord.transferred_to_account as bigint },
          data: {
            balance: {
              decrement: delta,
            },
          },
        }),
      ]);
      return {
        message: "Record Added Successfully",
        type: "Transfer",
        UpdatedRecord,
        from_account_balance,
        to_account_balance,
        statusCode: 200,
      };
      //  0 1
    } else if (
      existingRecord.account === params.data.account &&
      existingRecord.transferred_to_account !==
        params.data.transferred_to_account
    ) {
      const [
        UpdatedRecord,
        { balance: from_account_balance },
        { balance: to_account_balance },
      ] = await prisma.$transaction([
        RECORDS.update({ where: { id: params.id }, data: params.data }),
        ACCOUNTS.update({
          where: { id: params.data.account },
          data: {
            balance: {
              increment: delta,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: params.data.transferred_to_account as bigint },
          data: {
            balance: {
              increment: params.data.amount || existingRecord.amount,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: existingRecord.transferred_to_account as bigint },
          data: {
            balance: {
              decrement: existingRecord.amount,
            },
          },
        }),
      ]);
      return {
        message: "Record Added Successfully",
        type: "Transfer",
        UpdatedRecord,
        from_account_balance,
        to_account_balance,
        statusCode: 200,
      };
      //  1 0
    } else if (
      existingRecord.account !== params.data.account &&
      existingRecord.transferred_to_account ===
        params.data.transferred_to_account
    ) {
      const [
        UpdatedRecord,
        { balance: from_account_balance },
        { balance: to_account_balance },
      ] = await prisma.$transaction([
        RECORDS.update({ where: { id: params.id }, data: params.data }),
        ACCOUNTS.update({
          where: { id: params.data.account as bigint },
          data: {
            balance: {
              decrement: params.data.amount || existingRecord.amount,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: existingRecord.transferred_to_account as bigint },
          data: {
            balance: {
              decrement: delta,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: existingRecord.account },
          data: {
            balance: {
              increment: existingRecord.amount,
            },
          },
        }),
      ]);
      return {
        message: "Record Added Successfully",
        type: "Transfer",
        UpdatedRecord,
        from_account_balance,
        to_account_balance,
        statusCode: 200,
      };
    }
    else {
      const [
        UpdatedRecord,
        { balance: from_account_balance },
        { balance: to_account_balance },
      ] = await prisma.$transaction([
        RECORDS.update({ where: { id: params.id }, data: params.data }),
        ACCOUNTS.update({
          where: { id: params.data.account as bigint },
          data: {
            balance: {
              decrement: params.data.amount || existingRecord.amount,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: params.data.transferred_to_account as bigint },
          data: {
            balance: {
              increment: params.data.amount || existingRecord.amount,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: existingRecord.account },
          data: {
            balance: {
              increment: existingRecord.amount,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: existingRecord.transferred_to_account as bigint },
          data: {
            balance: {
              decrement: existingRecord.amount,
            },
          },
        }),
      ]);
      return {
        message: "Record Added Successfully",
        type: "Transfer",
        UpdatedRecord,
        from_account_balance,
        to_account_balance,
        statusCode: 200,
      };
    }
  } else if ((existingRecord.type === "Expense" && params.data.type === "Transfer"  )){
    if(existingRecord.account === params.data.account){
      const [
        UpdatedRecord,
        { balance: from_account_balance },
        { balance: to_account_balance },
      ] = await prisma.$transaction([
        RECORDS.update({ where: { id: params.id }, data: params.data }),
        ACCOUNTS.update({
          where: { id: existingRecord.account },
          data: {
            balance: {
              increment: delta,
            },
          },
        }),
        ACCOUNTS.update({
          where: { id: params.data.transferred_to_account as bigint },
          data: {
            balance: {
              increment: params.data.amount || existingRecord.amount,
            },
          },
        }),
      ]);
      return {
        message: "Record Added Successfully",
        type: "Transfer",
        UpdatedRecord,
        from_account_balance,
        to_account_balance,
        statusCode: 200,
      };
    } else {

    }
  }

      return { message: "Failed to Update Record", statusCode: 500, type:params.data.type};
};
export const UpdateRecord = async (
  params: RecordServiceTypes.UpdateRecordParams,
): Promise<RecordServiceTypes.UpdateRecordResponse> => {
  try {
    const existingRecord = await RECORDS.findMany({
      where: {
        id: params.id,
        user_id: params.user_id,
      },
    });
    const response = UpdateTransaction(existingRecord[0], {
      data: params.data,
      id: params.id,
      user_id: params.user_id,
    });
    return response
  } catch (error) {
    return { message: "Failed to Update Record", statusCode: 500, error , type:params.data.type};
  }
};

export const DeleteRecord = async (
  params: RecordServiceTypes.DeleteRecordParams,
): Promise<RecordServiceTypes.DeleteRecordResponse> => {
  try {
    const deletedRecord = await RECORDS.delete({
      where: {
        id: params.id,
      },
    });
    return { message: "Deleted Record", deletedRecord, statusCode: 200 };
  } catch (error) {
    return { message: "Failed to Delete Record", statusCode: 500, error };
  }
};
