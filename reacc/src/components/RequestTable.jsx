import StatusPill from "./StatusPill.jsx";

const TH =
  "px-3.5 py-3 text-left border-b border-border bg-base-soft text-ink-muted font-semibold text-[0.82rem]";
const TD = "px-3.5 py-3 text-left border-b border-border";


export default function RequestTable({ experiments }) {
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full text-[0.95rem] table-fixed">
        <thead>
          <tr>
            <th className={`w-[15%] ${TH}`}>ID</th>
            <th className={`w-[30%] ${TH}`}>Scientist</th>
            <th className={`w-[35%] ${TH}`}>Machine</th>
            <th className={`w-[20%] ${TH}`}>Status</th>
          </tr>
        </thead>
        <tbody>
          {experiments.length === 0 ? (
            <tr>
              <td colSpan={4} className={`${TD} text-ink-muted`}>
                No requests yet.
              </td>
            </tr>
          ) : (
            experiments.map((exp) => (
              <tr key={exp.id} className="hover:bg-base-soft">
                <td className={TD}>{exp.id}</td>
                <td className={TD}>{exp.scientist}</td>
                <td className={TD}>{exp.machine}</td>
                <td className={TD}>
                  <StatusPill status={exp.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
