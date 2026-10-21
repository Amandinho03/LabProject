import { ReactNode } from "react";

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  disabled = false,
  className = "mb-3",
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.875rem] font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="px-3.5 py-2.5 text-ink border border-border rounded-md bg-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-base-soft disabled:text-ink-muted"
      >
        {children}
      </select>
    </div>
  );
}