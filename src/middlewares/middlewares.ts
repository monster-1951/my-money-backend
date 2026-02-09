import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import z from "zod";
import ENV from "../config/env";
import { DecodedUserPayload } from "../types/express";
import { sessionUser } from "../types/AuthServiceTypes";

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
  const csrfSecretKey = ENV.CSRF_TOKEN_SECRET
  const token = req.cookies.sessionToken ;
  const CSRF_TOKEN = (req.headers["x-csrf-token"] as string);
  try {
    if (CSRF_TOKEN && token) {
      const decoded_csrf_token = Jwt.verify(CSRF_TOKEN, csrfSecretKey) as sessionUser
      const decoded = Jwt.verify(token, jwtSecretKey) as sessionUser
      req.user = decoded as DecodedUserPayload;
      if (decoded_csrf_token.email === decoded.email) {
        next();
      } else {
        res.status(403).send({ message: "Invalid CSRF Token" });
        return;
      }
    } else {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

export const AuthorizeCookieToIssueCSRF = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtSecretKey = ENV.JWT_SECRET_KEY;
  const token = req.cookies.sessionToken || "";
  try {
    const decoded = Jwt.verify(token, jwtSecretKey);
    req.user = decoded as DecodedUserPayload;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

export const sanitizeIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof req.params.id === "string") {
    req.body.id = BigInt(req.params.id);
  } else {
    req.body.id = BigInt(req.params.id[0]);
  }
  next();
};
