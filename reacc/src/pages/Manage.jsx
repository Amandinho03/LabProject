import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import SelectField from "../components/SelectField.jsx";
import RequestTable from "../components/RequestTable.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { authFetch } from "../lib/api.js";


function Section({ title, children }) {
  return (
    <div className="p-5 bg-primary-soft border border-primary/20 rounded-md mb-5">
      <h3 className="font-serif font-semibold text-ink mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ActionRadio({ value, label, current, onSelect, className = "mb-1.5" }) {
  return (
    <label
      className={`flex items-center gap-2 text-[0.95rem] cursor-pointer ${className}`}
    >
      <input
        type="radio"
        name="actionType"
        value={value}
        checked={current === value}
        onChange={() => onSelect(value)}
        className="accent-primary w-4 h-4"
      />
      {label}
    </label>
  );
}


const PLACEHOLDER_ID = "-- Select an ID first --";

export default function Manage() {
  const { user } = useAuth();
  const username = user?.username || "Unknown";
  const isAdmin = user?.role === "admin";


  const [machines, setMachines] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [loadError, setLoadError] = useState("");


  const [action, setAction] = useState(null); 
  const [addMachine, setAddMachine] = useState("");
  const [editId, setEditId] = useState("");
  const [editMachine, setEditMachine] = useState("");
  const [statusId, setStatusId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const [message, setMessage] = useState(null); 
  const [submitting, setSubmitting] = useState(false);

  
  const loadExperiments = useCallback(async () => {
    try {
      const res = await fetch("/api/experiments");
      const data = await res.json();
      if (data.success) {
        setExperiments(data.data);
        setLoadError("");
      } else {
        setLoadError(data.message || data.error || "Could not load requests.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setLoadError("Could not load requests. Is the server running?");
    }
  }, []);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        if (data.success) {
          setMachines(data.data.machines);
          setStatuses(data.data.statuses);
          setAddMachine(data.data.machines[0] ?? "");
        }
      } catch (err) {
        console.error("Config fetch error:", err);
      }
    }
    loadConfig();
    loadExperiments();
  }, [loadExperiments]);


  const label = (exp) =>
    `ID: ${exp.id} - ${exp.scientist} - ${exp.machine} - ${exp.status}`;

  const editableExperiments = experiments.filter(
    (exp) => isAdmin || exp.scientist === username,
  );

  const findExperiment = (id) => experiments.find((e) => String(e.id) === id);

  const editTarget = findExperiment(editId);
  const machineChoices = editTarget
    ? machines.filter((m) => m !== editTarget.machine)
    : [];

  const statusTarget = findExperiment(statusId);
  const statusChoices = statusTarget
    ? statuses.filter((s) => s !== statusTarget.status)
    : [];

  function chooseAction(value) {
    setAction(value);
    setMessage(null);
  }


  function chooseEditId(id) {
    setEditId(id);
    const exp = findExperiment(id);
    setEditMachine(exp ? (machines.find((m) => m !== exp.machine) ?? "") : "");
  }

  function chooseStatusId(id) {
    setStatusId(id);
    const exp = findExperiment(id);
    setNewStatus(exp ? (statuses.find((s) => s !== exp.status) ?? "") : "");
  }

  function resetSelections() {
    setEditId("");
    setEditMachine("");
    setStatusId("");
    setNewStatus("");
    setDeleteId("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    let url = "/api/experiments";
    let method;
    let payload;

    if (action === "add") {
      if (!addMachine) return fail("Please select a machine.");
      method = "POST";
      payload = { machine: addMachine };
    } else if (action === "edit") {
      if (!editId) return fail("Please select an ID.");
      url += `/${editId}`;
      method = "PATCH";
      payload = { machine: editMachine };
    } else if (action === "status") {
      if (!statusId) return fail("Please select an ID.");
      url += `/${statusId}`;
      method = "PATCH";
      payload = { status: newStatus };
    } else if (action === "delete") {
      if (!deleteId) return fail("Please select an ID.");
      if (!window.confirm(`Delete request #${deleteId}? This can't be undone.`))
        return;
      url += `/${deleteId}`;
      method = "DELETE";
    } else {
      return;
    }

    const options = { method };
    if (method !== "DELETE") {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(payload);
    }

    setSubmitting(true);
    try {

      const response = await authFetch(url, options);
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage({ text: "Success!", variant: "success" });
        resetSelections();
        loadExperiments();
      } else {
        fail(`Error: ${data.message || data.error || response.statusText}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      fail("Network error. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  }

  function fail(text) {
    setMessage({ text, variant: "error" });
  }

  const submitLabel =
    action === "delete" || action === "status"
      ? "Execute action"
      : "Submit request";

  return (
    <div className="bg-base text-ink font-sans antialiased flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-[1120px] mx-auto px-6 pt-10 pb-6">
          <h1 className="font-serif font-semibold text-[1.9rem] leading-tight mb-1">
            Manage lab requests
          </h1>
          <p className="text-ink-muted m-0">
            Submit a new instrument request, edit one of yours, or review the
            full queue below.
          </p>
        </div>

        <div className="max-w-[1120px] mx-auto px-6">
          <div className="bg-base border border-border rounded-lg p-7 shadow-sm mb-8">
            <div className="flex flex-col gap-1.5 mb-4">
              <label
                htmlFor="profile-username"
                className="text-[0.875rem] font-semibold text-ink"
              >
                Scientist username
              </label>
              <input
                type="text"
                id="profile-username"
                value={username}
                readOnly
                disabled
                className="px-3.5 py-2.5 text-base border border-border rounded-md bg-base-soft text-ink-muted cursor-not-allowed"
              />
            </div>

            <fieldset className="bg-base-soft border border-border rounded-md px-5 py-4 mb-6">
              <legend className="font-semibold text-[0.9rem] px-1">
                What would you like to do?
              </legend>
              <ActionRadio
                value="add"
                label="Add a new request"
                current={action}
                onSelect={chooseAction}
              />
              <ActionRadio
                value="edit"
                label="Edit an existing request"
                current={action}
                onSelect={chooseAction}
              />

              
              {isAdmin && (
                <div className="mt-2.5 pt-2.5 border-t border-dashed border-primary/30">
                  <ActionRadio
                    value="status"
                    label="Modify/Update status"
                    current={action}
                    onSelect={chooseAction}
                  />
                  <ActionRadio
                    value="delete"
                    label="Delete request"
                    current={action}
                    onSelect={chooseAction}
                    className=""
                  />
                </div>
              )}
            </fieldset>

            <form onSubmit={handleSubmit} noValidate>
              {action === "add" && (
                <Section title="Add request">
                  <SelectField
                    id="add-machine"
                    label="Select machine"
                    value={addMachine}
                    onChange={setAddMachine}
                    className="mb-0"
                  >
                    {machines.length === 0 && (
                      <option value="">-- Loading... --</option>
                    )}
                    {machines.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </SelectField>
                </Section>
              )}

              {action === "edit" && (
                <Section title="Edit request">
                  <SelectField
                    id="edit-id"
                    label="Select experiment"
                    value={editId}
                    onChange={chooseEditId}
                  >
                    <option value="">-- Select an Experiment --</option>
                    {editableExperiments.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {label(exp)}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    id="edit-machine"
                    label="Change machine to"
                    value={editMachine}
                    onChange={setEditMachine}
                    disabled={!editTarget}
                    className="mb-0"
                  >
                    {!editTarget && <option value="">{PLACEHOLDER_ID}</option>}
                    {machineChoices.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </SelectField>
                </Section>
              )}

              {action === "status" && (
                <Section title="Modify status">
                  <SelectField
                    id="status-id"
                    label="Select experiment"
                    value={statusId}
                    onChange={chooseStatusId}
                  >
                    <option value="">-- Select an Experiment --</option>
                    {experiments.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {label(exp)}
                      </option>
                    ))}
                  </SelectField>
                  <SelectField
                    id="modify-status"
                    label="Change status to"
                    value={newStatus}
                    onChange={setNewStatus}
                    disabled={!statusTarget}
                    className="mb-0"
                  >
                    {!statusTarget && <option value="">{PLACEHOLDER_ID}</option>}
                    {statusChoices.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </SelectField>
                </Section>
              )}

              {action === "delete" && (
                <Section title="Delete request">
                  <SelectField
                    id="delete-id"
                    label="Select experiment to cancel"
                    value={deleteId}
                    onChange={setDeleteId}
                    className="mb-0"
                  >
                    <option value="">-- Select an Experiment --</option>
                    {experiments.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {label(exp)}
                      </option>
                    ))}
                  </SelectField>
                </Section>
              )}

              {action && (
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex w-full items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-semibold text-white transition-colors border border-transparent disabled:opacity-60 disabled:cursor-not-allowed ${
                    action === "delete"
                      ? "bg-danger hover:bg-danger-dark"
                      : "bg-primary hover:bg-primary-dark"
                  }`}
                >
                  {submitting ? "Working..." : submitLabel}
                </button>
              )}
            </form>

            {message && (
              <StatusMessage text={message.text} variant={message.variant} />
            )}
          </div>

          <div className="bg-base border border-border rounded-lg p-7 shadow-sm mb-8">
            <h2 className="font-serif font-semibold text-[1.25rem] mb-3.5">
              Lab request dashboard
            </h2>
            {loadError ? (
              <StatusMessage text={loadError} variant="error" />
            ) : (
              <RequestTable experiments={experiments} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
