
const STYLES = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-success-bg text-success-text",
  completed: "bg-gray-100 text-gray-700",
  rejected: "bg-error-bg text-error-text",
};

export default function StatusPill({ status }) {
  const style =
    STYLES[String(status).toLowerCase()] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-block px-[0.65rem] py-1 rounded-full text-[0.8rem] font-semibold ${style}`}
    >
      {status}
    </span>
  );
}
