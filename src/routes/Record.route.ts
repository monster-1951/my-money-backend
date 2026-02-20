import express from "express";
import * as Middleware from "../middlewares/middlewares";
import * as Schemas from "../schemas/RecordSchema";
import * as RecordController from "../controllers/RecordController";

const record = express.Router();

record.use(Middleware.AuthorizeMiddleWare);

record.get("/", RecordController.GetRecords);

record.post(
  "/create",
  Middleware.validateRequestAgainstSchema(Schemas.IncomeExpenseRecordSchema),
  RecordController.CreateIncomeExpenseRecord,
);

record.post(
  "/create/transfer_record",
  Middleware.validateRequestAgainstSchema(Schemas.TransferRecordSchema),
  RecordController.CreateTransferRecord,
);

record.put(
  "/update/to_income_expense/:id",
  Middleware.validateRequestAgainstSchema(Schemas.IncomeExpenseRecordSchema),
  RecordController.UpdateIncomeExpenseRecord,
);

record.put(
  "/update/to_transfer_record/:id",
  Middleware.validateRequestAgainstSchema(Schemas.TransferRecordSchema),
  RecordController.UpdateTransferRecord,
);

record.patch(
  "/update/to_income_expense/:id",
  Middleware.validateRequestAgainstSchema(
    Schemas.ModifyIncomeExpenseRecordSchema,
  ),
  RecordController.UpdateIncomeExpenseRecord,
);

record.patch(
  "/update/to_transfer_record/:id",
  Middleware.validateRequestAgainstSchema(Schemas.ModifyTransferRecordSchema),
  RecordController.UpdateTransferRecord,
);

record.delete("/delete/:id", RecordController.DeleteRecord);

export default record;
