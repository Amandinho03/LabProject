import express from "express";
import rateLimit from "express-rate-limit";
import { validate, registerSchema, loginSchema } from "../middlewares/validation.js";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/register attempts. Please try again later.",
  },
});

router.post("/api/register", authLimiter, validate(registerSchema), registerUser);
router.post("/api/login", authLimiter, validate(loginSchema), loginUser);
router.post("/refresh_token", refreshUserToken);
router.post("/logout", logoutUser);

export default router;
