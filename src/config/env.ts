import { Env, envSchema } from "../schemas/envSchema";
import dotenv from 'dotenv'

dotenv.config();

const ENV:Env  = envSchema.parse(process.env) 

export default ENV
