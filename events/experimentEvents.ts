import { EventEmitter } from "events";

export const experimentEmitter = new EventEmitter();

export const EXPERIMENT_EVENTS = {
  CREATED: "EXPERIMENT_CREATED",
  STATUS_UPDATED: "EXPERIMENT_STATUS_UPDATED",
  DELETED: "EXPERIMENT_DELETED",
} as const;