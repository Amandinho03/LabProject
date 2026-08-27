import { experiments } from "../dummyDB.js";
import { AppError } from "../utils/AppError.js";

export const getExperiments = (req, res) => {
  return res.status(200).json({ success: true, data: experiments });
};

export const createExperiment = (req, res) => {
  const newExpt = {
    id:
      experiments.length > 0
        ? Math.max(...experiments.map((exp) => exp.id)) + 1
        : 1,
    scientist: req.user.username,
    machine: req.body.machine,
    status: "Pending",
  };
  experiments.push(newExpt);
  res.status(201).json({ success: true, data: newExpt });
};

export const updateExperiment = (req, res) => {
  const id = Number(req.params.id);
  const exp = experiments.find((e) => e.id === id);

  if (!exp) throw new AppError("Experiment not found!", 404);

  if (req.user.role !== "admin" && req.user.username !== exp.scientist) {
    throw new AppError("Forbidden! You do not own this.", 403);
  }

  if (req.body.machine) {
    exp.machine = req.body.machine;
    exp.status = "Pending";
  }

  if (req.body.status) {
    if (req.user.role !== "admin") throw new AppError("Admins only.", 403);
    exp.status = req.body.status;
  }

  res.status(200).json({ success: true, message: "Updated!", data: exp });
};

export const deleteExperiment = (req, res) => {
  const id = Number(req.params.id);
  const index = experiments.findIndex((e) => e.id === id);

  if (index === -1) throw new AppError("Not found!", 404);

  experiments.splice(index, 1);
  res.status(200).json({ success: true, message: `Experiment removed!` });
};
