import { Request, Response } from "express";
import * as RecordServices from "../services/Records.services";
import * as RecordType from "../types/RecordServiceTypes";

export const GetAll = async (req: Request, res: Response) => {
  const params = { user_id: req.user.id };
  const response = await RecordServices.GetAll(params);
  res.status(response.statusCode).send(response);
};

export const CreateIncomeExpenseRecord = async (
  req: Request,
  res: Response,
) => {
  const params: RecordType.IncomeExpenseRecord = {
    type: req.body.type,
    amount: req.body.amount,
    account_id: req.body.account_id,
    time: req.body.time,
    user_id: req.user.id,
    category_id: req.body.category_id,
    notes: req.body.notes,
  };
  const response = await RecordServices.CreateIncomeExpenseRecord(params);

  res.status(response.statusCode).send(response);
};

export const CreateTransferRecord = async (req: Request, res: Response) => {
  const params: RecordType.TransferRecord = {
    account_id: req.body.account_id,
    amount: req.body.amount,
    time: req.body.time,
    transferred_to_account_id: req.body.transferred_to_account_id,
    type: req.body.type,
    user_id: req.user.id,
  };
  const response = await RecordServices.CreateTransferRecord(params);
  res.status(response.statusCode).send(response);
};
