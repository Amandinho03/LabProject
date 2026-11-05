import { DBExperiment } from "../dummyDB.js";

export const EXPERIMENT_EVENTS = {
  CREATED: "EXPERIMENT_CREATED",
  STATUS_UPDATED: "EXPERIMENT_STATUS_UPDATED",
  DELETED: "EXPERIMENT_DELETED",
} as const;

export type EventName = typeof EXPERIMENT_EVENTS[keyof typeof EXPERIMENT_EVENTS];
export type EventHandler<T = any> = (payload: T) => Promise<void> | void;

// pub-sub
class CustomEventBus {
  private listeners: Record<string, EventHandler[]> = {};

  on<T>(event: EventName, handler: EventHandler<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler as EventHandler);
  }

  emit<T>(event: EventName, payload: T): void {
    const handlers = this.listeners[event];
    if (!handlers) return;

    
    handlers.forEach((handler) => {
      Promise.resolve(handler(payload)).catch((err) => {
        console.error(`[EventBus] Unhandled error in observer for ${event}:`, err);
      });
    });
  }
}

export const experimentBus = new CustomEventBus();

// payload interfaces
export interface ExperimentCreatedPayload {
  experiment: DBExperiment;
}

export interface ExperimentStatusUpdatedPayload {
  experimentId: number;
  scientistUsername: string;
  scientistEmail?: string;
  machine: string;
  oldStatus: string;
  newStatus: string;
  adminUsername?: string;
}

export interface ExperimentDeletedPayload {
  experimentId: number;
  deletedBy?: string;
}
