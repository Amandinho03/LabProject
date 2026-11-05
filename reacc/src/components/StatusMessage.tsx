import { ReactNode } from "react";

interface StatusMessageProps {
  text?: string | null;
  variant?: "success" | "error";
  children?: ReactNode;
}

export default function StatusMessage({ text, variant = "error", children }: StatusMessageProps) {
  // Return null if neither text nor children are provided
  if (!text && !children) return null;

  const variantClasses =
    variant === "success"
      ? "bg-success-bg text-success-text border-success-border"
      : "bg-error-bg text-error-text border-error-border";

  return (
    <p className={`mt-4 p-3 rounded-md text-sm font-medium border ${variantClasses}`}>
      {children || text}
    </p>
  );
}