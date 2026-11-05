import { AppError } from "../utils/AppError.js";

export type ProposalStatusName =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Completed";

export interface IProposalState {
  readonly name: ProposalStatusName;
  canModifyMachine(): boolean;
  allowedNextStatuses(): ProposalStatusName[];
  validateTransition(targetStatus: ProposalStatusName): void;
}

abstract class BaseProposalState implements IProposalState {
  abstract readonly name: ProposalStatusName;
  abstract canModifyMachine(): boolean;
  abstract allowedNextStatuses(): ProposalStatusName[];

  validateTransition(targetStatus: ProposalStatusName): void {
    if (targetStatus === this.name) return;
    const allowed = this.allowedNextStatuses();
    if (!allowed.includes(targetStatus)) {
      throw new AppError(
        `Invalid status transition: cannot move proposal from "${this.name}" to "${targetStatus}". Allowed: ${
          allowed.length > 0 ? allowed.join(", ") : "none (terminal state)"
        }.`,
        400,
      );
    }
  }
}

export class PendingState extends BaseProposalState {
  readonly name = "Pending" as const;
  canModifyMachine(): boolean {
    return true;
  }
  allowedNextStatuses(): ProposalStatusName[] {
    return ["Accepted", "Rejected"];
  }
}

export class AcceptedState extends BaseProposalState {
  readonly name = "Accepted" as const;
  canModifyMachine(): boolean {
    return false;
  }
  allowedNextStatuses(): ProposalStatusName[] {
    return ["Completed", "Rejected"];
  }
}

export class RejectedState extends BaseProposalState {
  readonly name = "Rejected" as const;
  canModifyMachine(): boolean {
    return true;
  }
  allowedNextStatuses(): ProposalStatusName[] {
    return ["Pending"];
  }
}

export class CompletedState extends BaseProposalState {
  readonly name = "Completed" as const;
  canModifyMachine(): boolean {
    return false;
  }
  allowedNextStatuses(): ProposalStatusName[] {
    return [];
  }
}

export class ProposalStateFactory {
  private static readonly states: Record<string, IProposalState> = {
    Pending: new PendingState(),
    Accepted: new AcceptedState(),
    Rejected: new RejectedState(),
    Completed: new CompletedState(),
  };

  static fromStatus(status: string): IProposalState {
    const state = this.states[status];
    if (!state) {
      throw new AppError(`Unknown proposal state: ${status}`, 400);
    }
    return state;
  }
}
