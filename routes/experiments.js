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

const router = express.Router();

const isAdmin = (req, res, next) => {
  try {
    req.user = isAuth(req);
    if (req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Forbidden! Admins only." });
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }
};

router.get("/", getExperiments);
router.post("/", requireAuth, validate(createExpSchema), createExperiment);
router.patch("/:id", requireAuth, validate(updateExpSchema), updateExperiment);
router.delete("/:id", isAdmin, deleteExperiment);

export default router;
