import { NextFunction, Request, Response } from "express";
import * as AuthServices from "../services/Auth.services";
import ENV from "../config/env";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await AuthServices.findUserAndValidateCredentials(
      req.body,
    );
    if (response.sessionUser) {
      const token = await AuthServices.generateJWTToken({
        sessionUser: response.sessionUser,
        secret: ENV.JWT_SECRET_KEY || "",
      });
      res.status(response.statusCode).cookie("sessionToken", token, {
        httpOnly: true,
        maxAge: 604800000,
        sameSite: "lax",
        secure: ENV.NODE_ENV === "production",
      });
      res.status(200).send({message:"HttpOnly cookie has been set",success:true});
    } else {
      res.status(response.statusCode).send({ message: response.message ,success:false});
    }
  } catch (error) {
    next(error)
  }
};

export const sendCurrentUserToBackend =(req: Request, res: Response) => {
    res.send(req.user);
  }
