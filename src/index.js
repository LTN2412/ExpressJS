import express from "express";
import bodyParser from "body-parser";
import homeRouter from "./routes/getHome.js";
import userRouter from "./routes/user.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", homeRouter);
app.use("/user", userRouter);
app.listen(PORT, () => {
  console.log(`Running at port ${PORT}`);
});
