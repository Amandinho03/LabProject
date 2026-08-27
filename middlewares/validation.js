import { z } from "zod";
import { MACHINES, STATUSES } from "../config.js";

export const MachineEnum = z.string().refine((val) => MACHINES.includes(val), {
  message: "Invalid machine selected.",
});

export const StatusEnum = z.string().refine((val) => STATUSES.includes(val), {
  message: "Invalid status selected.",
});

export const createExpSchema = z.object({ machine: MachineEnum });
export const updateExpSchema = z.object({
  machine: MachineEnum.optional(),
  status: StatusEnum.optional(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username should be at least 3 characters!")
    .max(20, "Username cannot exceed 20 characters!")
    .regex(/^[a-zA-Z0-9]+$/, "Only alphanumeric usernames allowed!"),
  password: z.string().min(5, "Password must be at least 5 characters!"),
});

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ success: false, errors: error.errors });
  }
};
