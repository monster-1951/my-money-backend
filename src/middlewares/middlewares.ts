import { NextFunction, Request, response, Response } from "express";
import Jwt from "jsonwebtoken";
import z from "zod";
import ENV from "../config/env";
import { DecodedUserPayload } from "../types/express";


export const convertStringToBigint = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body.user_id = BigInt(req.body.user_id);
  next();
};

export const validateRequestAgainstSchema =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const request = schema.safeParse(req.body);
    if (!request.success) {
      return res
        .status(422)
        .send({ message: "Input validation failed", error: request.error });
    }
    next();
  };

export const AuthorizeMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtSecretKey = ENV.JWT_SECRET_KEY;
  const token = req.cookies.sessionToken || ""
  try {
     const decoded = Jwt.verify(token,jwtSecretKey)
     req.user = decoded as DecodedUserPayload;
      next();
  } catch (error) {
    res.status(401).send(error);
  }

};

export const sanitizeIdParam = (req:Request,res:Response,next:NextFunction) => {
    if(typeof req.params.id=== 'string'){
      req.body.id = BigInt(req.params.id)
    } else {
      req.body.id = BigInt(req.params.id[0])
    }
    next()
}