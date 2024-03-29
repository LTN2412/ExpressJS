import db from "../db/postgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function getUser(userName) {
  var result = await db.query(
    `SELECT password FROM users where user_name='${userName}'`
  );
  return result;
}

export function getHashPwd(password) {
  var hash = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
  return hash;
}

export async function checkUser(inputUserName, password) {
  var user = await getUser(inputUserName);
  if (user.rowCount == 0) return false;
  var hashPassword = await db.query(
    `SELECT password FROM users WHERE user_name='${inputUserName}'`
  );
  return bcrypt.compareSync(password, hashPassword.rows[0]["password"]);
}

export function createToken(payload, secretKey, expires) {
  return jwt.sign(payload, secretKey, {
    expiresIn: expires,
  });
}

export function verifyToken(req, res, next) {
  const authoriztionHeader = req.headers["authorization"];
  const token = authoriztionHeader.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
  }
  try {
    var result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
  req.userName = result.user_name;
  next();
}

export async function getUserInfo(userName) {
  const user = await db.query(
    `SELECT user_name,full_name,email FROM users WHERE user_name='${userName}'`
  );
  return user;
}

export async function register(userName, password, email, full_name) {
  const hashPassword = getHashPwd(password);
  await db.query(
    `INSERT INTO users (user_name,password,full-name,email) VALUES ('${userName}','${hashPassword}','${full_name}','${email}')`
  );
}

export function getNewAccessToken(req, res, next) {
  const refreshToken = req.body.refresh_token;
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
  const newAccessToken = createToken(
    {},
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRES
  );
  req.accessToken = newAccessToken;
  next();
}
