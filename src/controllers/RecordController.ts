import { Request, Response } from "express";
import * as RecordServices from "../services/Records.services";
import * as RecordType from "../types/RecordServiceTypes";
import * as Utility from "../lib/helper";

export const GetRecords = async (req: Request, res: Response) => {
  const queryParams = Utility.TypeCastRecordFilters(req.query);
  const params = { user_id: req.user.id, queryParams };
  const response = await RecordServices.GetRecords(params);
  res.status(response.statusCode).send(response);
};

export const CreateIncomeExpenseRecord = async (req: Request,res: Response) => {
  const params: RecordType.CreateRecordParams = Utility.SanitizeCreateRecordParams(req.body,req.user.id)
  const response = await RecordServices.Create(params);
  res.status(response.statusCode).send(response);
};

export const CreateTransferRecord = async (req: Request, res: Response) => {
  const params: RecordType.CreateRecordParams =  Utility.SanitizeCreateTransferRecordParams(req.body,req.user.id)
  const response = await RecordServices.Create(params);
  res.status(response.statusCode).send(response);
};
