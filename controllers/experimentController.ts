import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { experimentService } from "../services/ExperimentService.js";
import { ExporterFactory } from "../exporters/ProposalExporter.js";

interface AuthPayload extends JwtPayload {
  username: string;
  role: string;
}

export const getExperiments = async (_req: Request, res: Response) => {
  const data = await experimentService.getAllExperiments();
  return res.status(200).json({ success: true, data });
};

export const createExperiment = async (req: Request, res: Response) => {
  const user = req.user as AuthPayload;
  const newExpt = await experimentService.createExperiment(
    user.username,
    req.body.machine,
  );
  return res.status(201).json({ success: true, data: newExpt });
};

export const updateExperiment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = req.user as AuthPayload;
  const updated = await experimentService.updateExperiment(id, user, req.body);

  return res
    .status(200)
    .json({ success: true, message: "Updated!", data: updated });
};

export const deleteExperiment = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await experimentService.deleteExperiment(id);

  return res
    .status(200)
    .json({ success: true, message: "Experiment removed!" });
};

export const exportExperiments = async (req: Request, res: Response) => {
  const format = String(req.query.format || "csv");
  const exporter = ExporterFactory.getExporter(format);
  const data = await experimentService.getAllExperiments();
  const output = exporter.export(data);

  res.setHeader("Content-Type", exporter.contentType);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="proposals.${exporter.extension}"`,
  );
  return res.status(200).send(output);
};
