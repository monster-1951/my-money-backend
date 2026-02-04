import { ServiceResponse } from "./StandardTypes";


export interface sessionUser {
  id: BigInt;
  name: string;
  email: string;
}

export interface findUserAndValidateCredentialsResponse extends ServiceResponse{
  sessionUser?: sessionUser;
}

export interface findUserAndValidateCredentialsParams {
  email: string;
  password: string;
}

export interface generateJWTTokenParams {
  sessionUser: sessionUser;
  secret: string;
}
