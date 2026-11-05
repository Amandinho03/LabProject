import express from "express";
import { requireAuth } from "../isAuth.js";
import { requirePermission } from "../middlewares/rbac.js";
import { PERMISSIONS } from "../config/permissions.js";
import { exportExperiments } from "../controllers/experimentController.js";
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

router.get("/", getExperiments);
router.get("/export", exportExperiments);
router.post(
  "/",
  requireAuth,
  requirePermission(PERMISSIONS.CREATE_EXPERIMENT),
  validate(createExpSchema),
  createExperiment,
);
router.patch(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.EDIT_EXPERIMENT),
  validate(updateExpSchema),
  updateExperiment,
);
router.delete(
  "/:id",
  requireAuth,
  requirePermission(PERMISSIONS.DELETE_EXPERIMENT),
  deleteExperiment,
);

export default router;
