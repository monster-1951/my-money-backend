import express from 'express'
import { AuthorizeMiddleWare, validateRequestAgainstSchema } from '../middlewares/middlewares';


const user = express.Router()

user.use(AuthorizeMiddleWare)

export default user