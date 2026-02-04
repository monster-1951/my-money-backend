import express from 'express'
import * as AccountController from '../controllers/AccountController'
import { AuthorizeMiddleWare, convertStringToBigint, sanitizeIdParam, validateRequestAgainstSchema } from '../middlewares/middlewares'
import { AccountModifySchema, AccountSchema } from '../schemas/AccountSchema'

const account = express.Router()


account.use(AuthorizeMiddleWare)

account.get("/",AccountController.GetAllAccounts)
account.get("/:id",AccountController.GetAccountById)

account.post("/create",validateRequestAgainstSchema(AccountSchema),AccountController.Create)

account.put("/update/:id",validateRequestAgainstSchema(AccountSchema),AccountController.Update)

account.patch("/update/:id",validateRequestAgainstSchema(AccountModifySchema),AccountController.Update)

account.delete("/delete/:id",AccountController.Delete)

export default account