import express from "express";
import { validate, registerSchema } from "../middlewares/validation.js";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/api/register", validate(registerSchema), registerUser);
router.post("/api/login", loginUser);
router.post("/refresh_token", refreshUserToken);
router.post("/logout", logoutUser);

export default router;
