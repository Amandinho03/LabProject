export async function loadDashboard(experiments) {
  const tbody = document.getElementById("table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  experiments.forEach((exp) => {
    const tr = document.createElement("tr");
    [exp.id, exp.scientist, exp.machine, exp.status].forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
