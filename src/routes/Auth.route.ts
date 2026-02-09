import express, { Request, Response } from "express";
import { AuthorizeCookieToIssueCSRF, AuthorizeMiddleWare, validateRequestAgainstSchema } from "../middlewares/middlewares";
import { LoginSchema } from "../schemas/LoginSchema";
import { loginController, sendCurrentUserToBackend } from "../controllers/Authcontrollers";
import { UserSchema } from "../schemas/UserSchema";
import { createUserController } from "../controllers/Usercontrollers";

const auth = express.Router();

auth.get("/me",AuthorizeCookieToIssueCSRF,sendCurrentUserToBackend)

auth.post("/login",validateRequestAgainstSchema(LoginSchema),loginController);

auth.post("/register",validateRequestAgainstSchema(UserSchema),createUserController);

export default auth;
