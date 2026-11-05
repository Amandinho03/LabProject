import { AppError } from "../utils/AppError.js";

import {
  experimentBus,
  EXPERIMENT_EVENTS,
} from "../events/experimentEvents.js";
import {
  IExperimentRepository,
  InMemoryExperimentRepository,
} from "../repositories/ExperimentRepository.js";

import { DBExperiment } from "../dummyDB.js";
import { PaymentProcessor } from "../strategies/PaymentStrategy.js";
import {
  ProposalStateFactory,
  ProposalStatusName,
} from "../states/ProposalState.js";

interface RequestUser {
  role?: string;
  username?: string;
}

export class ExperimentCommandService {
  private readonly repository: IExperimentRepository;

  constructor(repository: IExperimentRepository) {
    this.repository = repository;
  }

  async getAllExperiments(): Promise<DBExperiment[]> {
    return await this.repository.getAll();
  }

  async createExperiment(
    scientistUsername: string,
    machineType: string,
    scientistEmail?: string,
  ): Promise<DBExperiment> {
    const newExptData = {
      scientist: scientistUsername,
      scientistEmail: scientistEmail,
      machine: machineType,
      status: "Pending",
    };

    const created = await this.repository.create(newExptData);
    experimentBus.emit(EXPERIMENT_EVENTS.CREATED, { experiment: created });
    return created;
  }

  async updateExperiment(
    id: number | string,
    user: RequestUser,
    updates: Partial<DBExperiment>,
  ): Promise<DBExperiment> {
    const exp = await this.repository.getById(id);

    if (!exp) throw new AppError("Experiment not found!", 404);

    if (user.role !== "admin" && user.username !== exp.scientist) {
      throw new AppError("Forbidden! You do not own this.", 403);
    }

    const oldStatus = exp.status;

    const currentState = ProposalStateFactory.fromStatus(exp.status);

    if (updates.machine) {
      if (!currentState.canModifyMachine()) {
        throw new AppError(
          `Cannot change machine while proposal is "${exp.status}".`,
          400,
        );
      }
      exp.machine = updates.machine;
      exp.status = "Pending";
    }

    if (updates.status) {
      if (user.role !== "admin") throw new AppError("Admins only.", 403);
      currentState.validateTransition(updates.status as ProposalStatusName);
      exp.status = updates.status;
    }

    if (oldStatus !== "Accepted" && exp.status === "Accepted") {
      // payment
      const processor = PaymentProcessor.fromMode("GRANT");
      await processor.execute(5000, {
        id: exp.id,
        username: exp.scientist,
        email: exp.scientistEmail,
      });
    }

    if (oldStatus !== exp.status) {
      experimentBus.emit(EXPERIMENT_EVENTS.STATUS_UPDATED, {
        experimentId: exp.id,
        scientistUsername: exp.scientist,
        scientistEmail: exp.scientistEmail,
        machine: exp.machine,
        oldStatus: oldStatus,
        newStatus: exp.status,
        adminUsername: user.username,
      });
    }
    await this.repository.update(id, exp);
    return exp;
  }

  async deleteExperiment(
    id: number | string,
    deletedBy?: string,
  ): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new AppError("Not found!", 404);

    experimentBus.emit(EXPERIMENT_EVENTS.DELETED, {
      experimentId: Number(id),
      deletedBy,
    });
  }
}

const experimentRepository = new InMemoryExperimentRepository();
export const experimentService = new ExperimentCommandService(
  experimentRepository,
);
