import { AppError } from "../utils/AppError.js";
import { experimentEmitter, EXPERIMENT_EVENTS } from "../events/experimentEvents.js";
import { ExperimentRepository } from "../repositories/ExperimentRepository.js";
import { DBExperiment } from "../dummyDB.js";


interface RequestUser {
  role?: string;
  username?: string;
}

export class ExperimentCommandService {
  repository: typeof ExperimentRepository;

  constructor(repository: typeof ExperimentRepository) {
    this.repository = repository;
  }

  async getAllExperiments(): Promise<DBExperiment[]> {
    return await this.repository.getAll();
  }

  async createExperiment(scientistUsername: string, machineType: string, scientistEmail?: string): Promise<DBExperiment> {
    const newExptData = {
      scientist: scientistUsername,
      scientistEmail: scientistEmail, 
      machine: machineType,
      status: "Pending",
    };

    return await this.repository.create(newExptData);
  }

  async updateExperiment(id: number | string, user: RequestUser, updates: Partial<DBExperiment>): Promise<DBExperiment> {
    const exp = await this.repository.getById(id);

    if (!exp) throw new AppError("Experiment not found!", 404);

    if (user.role !== "admin" && user.username !== exp.scientist) {
      throw new AppError("Forbidden! You do not own this.", 403);
    }
    
    const oldStatus = exp.status;
   
    if (updates.machine) {
      exp.machine = updates.machine;
      exp.status = "Pending";
    }

    if (updates.status) {
      if (user.role !== "admin") throw new AppError("Admins only.", 403);
      exp.status = updates.status;
    }
  
    if (oldStatus !== exp.status) {
      experimentEmitter.emit(EXPERIMENT_EVENTS.STATUS_UPDATED, {
        experimentId: exp.id,
        scientistUsername: exp.scientist,
        scientistEmail: exp.scientistEmail,
        oldStatus: oldStatus,
        newStatus: exp.status,
        adminUsername: user.username,
      });
    }
  await this.repository.update(id, exp);
    return exp;
  }

  async deleteExperiment(id: number | string): Promise<void> {
    const index = await this.repository.findIndex(id);
    if (index === -1) throw new AppError("Not found!", 404);
    
    await this.repository.delete(index);
  }
  
}

export const experimentService = new ExperimentCommandService(ExperimentRepository);