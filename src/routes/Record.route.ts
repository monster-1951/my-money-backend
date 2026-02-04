import express, { Request,Response } from 'express'
import { getAllRecords } from '../services/Records.services';
import { AuthorizeMiddleWare, validateRequestAgainstSchema } from '../middlewares/middlewares';
import { TransactionRecordSchema } from '../schemas/TransactionRecord.schema';

const record = express.Router()

record.use(AuthorizeMiddleWare)

record.get("/getAll", async (req: Request, res:Response) => {
  const allRecords = await getAllRecords();
  res.send({allRecords,user:req.user});
});

record.post(
  "/create",
  validateRequestAgainstSchema(TransactionRecordSchema),
  async (req: Request, res: Response) => {
    res.send(req);
  },
);
export default record