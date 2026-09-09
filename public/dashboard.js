export async function loadDashboard(experiments) {
  const tbody = document.getElementById("table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!experiments.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No requests yet.";
    td.style.color = "var(--color-ink-muted)";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  experiments.forEach((exp) => {
    const tr = document.createElement("tr");

    [exp.id, exp.scientist, exp.machine].forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });

    const statusTd = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = `status-pill status-${String(exp.status).toLowerCase()}`;
    pill.textContent = exp.status;
    statusTd.appendChild(pill);
    tr.appendChild(statusTd);

    tbody.appendChild(tr);
  });
}
