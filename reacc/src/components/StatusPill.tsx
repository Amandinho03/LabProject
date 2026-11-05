type ExperimentStatus = "Pending" | "Accepted" | "Completed" | "Rejected";

interface StatusPillProps {
  status: ExperimentStatus | string; 
}

const STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-success-bg text-success-text",
  completed: "bg-gray-100 text-gray-700",
  rejected: "bg-error-bg text-error-text",
};

export default function StatusPill({ status }: StatusPillProps) {

  const normalizedStatus = String(status).toLowerCase();
  const style = STYLES[normalizedStatus] ?? "bg-gray-100 text-gray-700";
  
  return (
    <span
      className={`inline-block px-[0.65rem] py-1 rounded-full text-[0.8rem] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}
