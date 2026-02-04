import { hashSync } from "bcrypt-ts";
import { prisma } from "../lib/prisma";
import { sessionUser } from "../types/AuthServiceTypes";
import { salt } from "../config/Auth";

interface createUserServiceParams {
    name:string,
    email:string,
    password:string
}

interface User extends sessionUser{
    password_hash:string
}
interface createUserServiceResponse {
    user ?: User,
    message: string
    error ?: unknown
    statusCode : number
}

export const findUserByEmail = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return user ? user : null;
};

export const createUserService = async (params:createUserServiceParams):Promise<createUserServiceResponse>=>{
    try {
    const existingUser = await findUserByEmail(params.email)
    if(existingUser){
      console.log("User exists",existingUser)
      return {message:"User already exists", statusCode:409}
    }
    const password_hash = hashSync(params.password, salt);
    const newUser = await prisma.users.create({
      data: {
        name: params.name,
        email: params.email,
        password_hash,
      },
    });
    return {user: newUser,message:"User Registered Successfully", statusCode:200}
    } catch (error) {
      return {message:"User regristration failed",error, statusCode:500 }
    }
}