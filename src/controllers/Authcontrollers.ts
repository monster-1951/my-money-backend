import { NextFunction, Request, Response } from "express";

import * as AuthServices from "../services/Auth.services";
import ENV from "../config/env";


export const loginController =  async (req: Request, res: Response,next:NextFunction) => {
  try {
    const response = await AuthServices.findUserAndValidateCredentials(req.body);
    if (response.sessionUser) {
        const token = await AuthServices.generateJWTToken({
        sessionUser: response.sessionUser,
        secret: ENV.JWT_SECRET_KEY || "",
        });
        res
        .status(response.statusCode)
        .send({ message: "Login Successfull", user: response.sessionUser , token});
    } else {
        res.status(response.statusCode).send({message:response.message})
    }
  } catch (error) {
    next(error)
  }
}