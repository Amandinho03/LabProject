import express, { Request, Response } from "express";
import { MACHINES, STATUSES } from "../config.js";

const router = express.Router();

router.get("/api/config", (req: Request, res: Response) => {
  return res.status(200).json({ 
    success: true, 
    data: { 
      machines: MACHINES, 
      statuses: STATUSES 
    } 
  });
});

export default router;