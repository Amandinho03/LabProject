import {
  ExperimentCreatedPayload,
  ExperimentStatusUpdatedPayload,
  ExperimentDeletedPayload,
} from "../events/experimentEvents.js";

export interface AuditLogEntry {
  timestamp: string;
  event: string;
  details: string;
}

// In-memory audit log
export const auditLogs: AuditLogEntry[] = [];

export function logCreated({ experiment }: ExperimentCreatedPayload): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event: "EXPERIMENT_CREATED",
    details: `Proposal #${experiment.id} submitted by ${experiment.scientist} for ${experiment.machine}`,
  };
  auditLogs.push(entry);
  console.log(`[AUDIT] ${entry.timestamp} | ${entry.details}`);
}

export function logStatusUpdated(payload: ExperimentStatusUpdatedPayload): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event: "EXPERIMENT_STATUS_UPDATED",
    details: `Proposal #${payload.experimentId} (${payload.machine}) status changed from "${payload.oldStatus}" to "${payload.newStatus}" by ${payload.adminUsername || "system"}`,
  };
  auditLogs.push(entry);
  console.log(`[AUDIT] ${entry.timestamp} | ${entry.details}`);
}

export function logDeleted({ experimentId, deletedBy }: ExperimentDeletedPayload): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    event: "EXPERIMENT_DELETED",
    details: `Proposal #${experimentId} deleted by ${deletedBy || "admin"}`,
  };
  auditLogs.push(entry);
  console.log(`[AUDIT] ${entry.timestamp} | ${entry.details}`);
}