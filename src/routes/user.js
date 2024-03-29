import express from "express";
import { verifyToken, getUserInfo, register } from "../utils/index.js";
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", verifyToken, async (req, res) => {
  const user = await getUserInfo(req.userName);
  res.json(user.rows[0]);
});

router.post("/register", async (req, res) => {
  await register(req.body.user_name, req.body.password, req.body.email);
  res.json({ ok: 200 });
});

export default router;
