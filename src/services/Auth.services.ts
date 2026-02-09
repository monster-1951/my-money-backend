import { compareSync } from "bcrypt-ts";
import Jwt from "jsonwebtoken";
import * as AuthServiceTypes from "../types/AuthServiceTypes";
import * as UserServices from "./Users.services";

export const findUserAndValidateCredentials = async (
  params: AuthServiceTypes.findUserAndValidateCredentialsParams,
): Promise<AuthServiceTypes.findUserAndValidateCredentialsResponse> => {
  const user = await UserServices.findUserByEmail(params.email);
  if (user) {
    const passwordMatch = compareSync(params.password, user.password_hash);

    return passwordMatch
      ? {
          sessionUser: { id: user.id, name: user.name, email: user.email },
          message: "Credentials validated",
          statusCode: 200,
        }
      : { message: "Wrong password", statusCode: 401 };
  } else {
    return { message: `User not found`, statusCode: 404 };
  }
};

export const generateJWTToken = async (
  params: AuthServiceTypes.generateJWTTokenParams,
) => {
  return Jwt.sign(params.sessionUser, params.secret, { expiresIn: "7d" });
};

export const generateCSRFToken = async (params: {
  payload: { payloadValue: string };
  secret: string;
}) => {
  return Jwt.sign(params.payload, params.secret, { expiresIn: "7d" });
};
