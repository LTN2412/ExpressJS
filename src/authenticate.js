import express from "express";
import bodyParser from "body-parser";
import { createToken, getNewAccessToken } from "./utils/index.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT_AUTHENTICATE;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/token", (req, res) => {
  const accessToken = createToken(
    req.body,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRES
  );
  const refreshToken = createToken(
    {},
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRES
  );
  return res.json({
    access_token: accessToken,
    refreshToken: refreshToken,
    token_type: "Bearer",
  });
});
app.post("/re_access_token", getNewAccessToken, (req, res) => {
  res.json({
    access_token: req.accessToken,
    token_type: "Bearer",
  });
});
app.listen(PORT, () => {
  console.log(`Authenticate Server running on ${PORT}`);
});
