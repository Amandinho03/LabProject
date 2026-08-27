import express from "express";
import { MACHINES, STATUSES } from "../config.js";

const router = express.Router();

router.get("/api/config", (req, res) => {
  return res.status(200).json({ 
    success: true, 
    data: { 
      machines: MACHINES, 
      statuses: STATUSES 
    } 
  });
});

export default router;