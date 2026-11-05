import { experimentBus, EXPERIMENT_EVENTS } from "./experimentEvents.js";
import { 
  ExperimentCreatedPayload, 
  ExperimentStatusUpdatedPayload, 
  ExperimentDeletedPayload 
} from "./experimentEvents.js";



// audit observers
experimentBus.on(EXPERIMENT_EVENTS.CREATED, async (payload: ExperimentCreatedPayload) => {
  const { logCreated } = await import("../observers/auditObserver.js");
  logCreated(payload);
});

experimentBus.on(EXPERIMENT_EVENTS.STATUS_UPDATED, async (payload: ExperimentStatusUpdatedPayload) => {
  const { logStatusUpdated } = await import("../observers/auditObserver.js");
  logStatusUpdated(payload);
});

experimentBus.on(EXPERIMENT_EVENTS.DELETED, async (payload: ExperimentDeletedPayload) => {
  const { logDeleted } = await import("../observers/auditObserver.js");
  logDeleted(payload);
});

// email notification observers
experimentBus.on(EXPERIMENT_EVENTS.STATUS_UPDATED, async (payload: ExperimentStatusUpdatedPayload) => {
  const { sendStatusEmail } = await import("../observers/emailObserver.js");
  await sendStatusEmail(payload);
});