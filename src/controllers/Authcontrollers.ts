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
        secret: ENV.JWT_SECRET_KEY,
      });
      res.status(response.statusCode).cookie("sessionToken", token, {
        httpOnly: true,
        maxAge: 604800000,
        sameSite: "none",
        secure: ENV.COOKIE_SECURE === "true",
      });
      res
        .status(200)
        .send({
          message: "HttpOnly cookie has been set",
          success: true,
          CSRF_TOKEN: crypto.randomUUID(),
        });
      console.log({ message: "HttpOnly cookie has been set", success: true });
    } else {
      res
        .status(response.statusCode)
        .send({ message: response.message, success: false });
      console.log({ message: response.message, success: false });
    }
  } catch (error) {
    next(error);
  }
};

export const sendCurrentUserToBackend = async (req: Request, res: Response) => {
  const token = await AuthServices.generateJWTToken({
    sessionUser:{id:req.user.id,email:req.user.email,name:req.user.name},
    secret:ENV.CSRF_TOKEN_SECRET
  })
  res.send({ USER: req.user, CSRF_TOKEN: token });
};
