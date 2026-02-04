import express from 'express'
import * as CategoryController from '../controllers/CategoryController'
import * as Middleware from '../middlewares/middlewares'
import * as Schemas from '../schemas/CategorySchema'

const category = express.Router()

category.use(Middleware.AuthorizeMiddleWare)

category.get("/",CategoryController.getAllCategories)

category.get("/:id",CategoryController.getCategory)

category.post("/create",Middleware.validateRequestAgainstSchema(Schemas.CategorySchema),CategoryController.Create)

category.put("/update/:id",Middleware.validateRequestAgainstSchema(Schemas.CategorySchema),CategoryController.Update)

category.patch("/update/:id",Middleware.validateRequestAgainstSchema(Schemas.CategoryModifySchema),CategoryController.Update)

category.delete("/delete/:id",CategoryController.Delete)

export default category