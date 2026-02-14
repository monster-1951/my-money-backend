import { Request, Response } from "express";
import * as AccountServices from "../services/Account.services";
import * as Helper from "../lib/helper";

export const Create = async (req: Request, res: Response) => {
  const params = {
    name: req.body.name,
    balance: req.body.balance,
    user_id: req.user.id,
    icon: Helper.sanitizeId(req.body.icon),
  };
  const response = await AccountServices.createNewAccount(params);
  res.status(response.statusCode).send(response);
};

export const GetAllAccounts = async (req: Request, res: Response) => {
  const params = { user_id: req.user.id };
  const response = await AccountServices.getAllAccounts(params);
  res.status(response.statusCode).send(response);
};

export const GetAccountById = async (req: Request, res: Response) => {
  const params = { user_id: req.user.id, id: req.params.id };
  const response = await AccountServices.findExistingAccountByIdOrName(params);
  res.status(response.statusCode).send(response);
};

export const Update = async (req: Request, res: Response) => {
  const params = {
    id: req.params.id,
    dataToModify: req.body,
    user_id: req.user.id,
  };
  const response = await AccountServices.updateAccount(params);
  res.status(response.statusCode).send(response);
};

export const Delete = async (req: Request, res: Response) => {
  const params = {
    id: req.params.id,
    user_id: req.user.id,
  };
  const response = await AccountServices.deleteAccount(params);
  res.status(response.statusCode).send(response);
};
