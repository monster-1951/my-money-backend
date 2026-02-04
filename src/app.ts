import express, { Request, Response } from "express";
import auth from "./routes/Auth.route";
import user from "./routes/User.route";
import record from "./routes/Record.route";
import account from "./routes/Account.route";

const app = express();

app.use(express.json());

app.use("/auth",auth)
app.use("/user",user)
app.use("/record",record)
app.use("/account",account)

app.get("/", (req: Request, res: Response) => {
  res.send("Guruji!!! You are great");
});


export default app;
