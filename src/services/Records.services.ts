import { prisma } from "../lib/prisma";
import * as RecordServiceTypes from "../types/RecordServiceTypes";

const RECORDS = prisma.records;

export const GetRecords = async (
  params: RecordServiceTypes.GetAllRecordsParams,
): Promise<RecordServiceTypes.GetAllRecordsResponse> => {
  console.log(params.queryParams)
  try {
    const Records = await RECORDS.findMany({
      where: {
        user_id: params.user_id,
        AND: params.queryParams.filters,
      },
      skip:(params.queryParams.page) || 0,
      take:10
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

export const UpdateRecord = async (params:RecordServiceTypes.UpdateRecordParams):Promise<RecordServiceTypes.UpdateRecordResponse> => {
  try {
    const UpdatedRecord = await RECORDS.update({
      where:{
        id:params.id,
        user_id:params.user_id
      },
      data:params.data
    })
   return { message: "Updated record Successfully", statusCode: 200, UpdatedRecord }
  } catch (error) {
   return { message: "Failed to Update Record", statusCode: 500, error }
  }
}

export const DeleteRecord = async (
  params: RecordServiceTypes.DeleteRecordParams,
): Promise<RecordServiceTypes.DeleteRecordResponse> => {
  try {
    const deletedRecord = await RECORDS.delete({
      where: {
        id:params.id,
      },
    });
    return { message: "Deleted Record", deletedRecord, statusCode: 200 };
  } catch (error) {
    return { message: "Failed to Delete Record", statusCode: 500, error };
  }
};
