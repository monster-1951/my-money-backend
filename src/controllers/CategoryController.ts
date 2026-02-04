import { Request, Response } from "express";
import * as CategoryServices from "../services/Category.services";

export const getAllCategories = async (req: Request, res: Response) => {
  const params = { user_id: req.user.id };
  const response = await CategoryServices.getAll(params);
  res.status(response.statusCode).send(response);
};

export const getCategory = async (req: Request, res: Response) => {
  const params = { user_id: req.user.id, id: req.params.id };
  const response = await CategoryServices.findExistingCategoryById(params);
  res.status(response.statusCode).send(response);
};

export const Create = async (req: Request, res: Response) => {
  const params = {
    user_id: req.user.id,
    name: req.body.name,
    category_type: req.body.category_type,
  };
  const response = await CategoryServices.Create(params);
  res.status(response.statusCode).send(response);
};

export const Update = async (req: Request, res: Response) => {
    const params = {
    user_id: req.user.id,
    id:req.params.id,
    dataToModify:req.body
  };
  const response = await CategoryServices.UpdateCategory(params);
  res.status(response.statusCode).send(response);
}

export const Delete = async (req: Request, res: Response) => {
  const params = { user_id: req.user.id, id: req.params.id };
  const response = await CategoryServices.DeleteCategory(params);
  res.status(response.statusCode).send(response);
};
