import { genSaltSync, hashSync } from "bcrypt-ts";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { salt } from "../config/Auth";
import { createUserService } from "../services/Users.services";

export const createUserController =  async (req: Request, res: Response) => {
    const response = await createUserService(req.body)
    res.status(response.statusCode).send(response);
  }