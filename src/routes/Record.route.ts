import express, { Request, Response } from "express";
import * as Middleware from "../middlewares/middlewares";
import * as Schemas from "../schemas/RecordSchema";
import * as RecordController from '../controllers/RecordController'


const record = express.Router();

record.use(Middleware.AuthorizeMiddleWare);

record.get("/", RecordController.GetRecords);


record.post(
  "/create/",
  Middleware.validateRequestAgainstSchema(Schemas.IncomeExpenseRecordSchema),
  RecordController.CreateIncomeExpenseRecord
);

record.post(
  "/create/transer_record",
  Middleware.validateRequestAgainstSchema(Schemas.TransferRecordSchema),
  RecordController.CreateTransferRecord
);
export default record;
