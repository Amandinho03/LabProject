import { experiments } from "../dummyDB.js";

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

  if (!exp)
    return res
      .status(404)
      .json({ success: false, message: "Experiment not found!" });

  if (req.user.role !== "admin" && req.user.username !== exp.scientist) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden! You do not own this." });
  }

  if (req.body.machine) {
    exp.machine = req.body.machine;
    exp.status = "Pending";
  }

  if (req.body.status) {
    if (req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Admins only." });
    exp.status = req.body.status;
  }

  res.status(200).json({ success: true, message: "Updated!", data: exp });
};

export const deleteExperiment = (req, res) => {
  const id = Number(req.params.id);
  const index = experiments.findIndex((e) => e.id === id);

  if (index === -1)
    return res.status(404).json({ success: false, message: `Not found!` });

  experiments.splice(index, 1);
  res.status(200).json({ success: true, message: `Experiment removed!` });
};
