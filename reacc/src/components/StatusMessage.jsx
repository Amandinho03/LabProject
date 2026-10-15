
export default function StatusMessage({ text, variant = "error" }) {
  if (!text) return null;

  const variantClasses =
    variant === "success"
      ? "bg-success-bg text-success-text border-success-border"
      : "bg-error-bg text-error-text border-error-border";

  return (
    <p className={`mt-4 p-3 rounded-md text-sm font-medium border ${variantClasses}`}>
      {text}
    </p>
  );
}
