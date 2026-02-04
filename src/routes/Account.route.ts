import express from 'express'
import * as AccountController from '../controllers/AccountController'
import * as Middleware from '../middlewares/middlewares'
import * as Schemas from '../schemas/AccountSchema'

const account = express.Router()

account.use(Middleware.AuthorizeMiddleWare)

account.get("/",AccountController.GetAllAccounts)

account.get("/:id",AccountController.GetAccountById)

account.post("/create",Middleware.validateRequestAgainstSchema(Schemas.AccountSchema),AccountController.Create)

account.put("/update/:id",Middleware.validateRequestAgainstSchema(Schemas.AccountSchema),AccountController.Update)

account.patch("/update/:id",Middleware.validateRequestAgainstSchema(Schemas.AccountModifySchema),AccountController.Update)

account.delete("/delete/:id",AccountController.Delete)

export default account