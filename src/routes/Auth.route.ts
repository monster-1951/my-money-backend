import express, { Request, Response } from "express";
import { validateRequestAgainstSchema } from "../middlewares/middlewares";
import { LoginSchema } from "../schemas/LoginSchema";
import { loginController } from "../controllers/Authcontrollers";
import { UserSchema } from "../schemas/UserSchema";
import { createUserController } from "../controllers/Usercontrollers";

const auth = express.Router();

auth.post("/login",validateRequestAgainstSchema(LoginSchema),loginController);

auth.post("/register",validateRequestAgainstSchema(UserSchema),createUserController);

export default auth;
