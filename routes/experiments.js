import express from "express";
import { isAuth, requireAuth } from "../isAuth.js";
import {
  validate,
  createExpSchema,
  updateExpSchema,
} from "../middlewares/validation.js";
import {
  getExperiments,
  createExperiment,
  updateExperiment,
  deleteExperiment,
} from "../controllers/experimentController.js";
import { AppError } from "../utils/AppError.js";

const router = express.Router();

const isAdmin = (req, res, next) => {
  req.user = isAuth(req);
  if (req.user.role !== "admin") {
    throw new AppError("Forbidden! Admins only.", 403);
  }
  next();
};

router.get("/", getExperiments);
router.post("/", requireAuth, validate(createExpSchema), createExperiment);
router.patch("/:id", requireAuth, validate(updateExpSchema), updateExperiment);
router.delete("/:id", isAdmin, deleteExperiment);

export default router;
