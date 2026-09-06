import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className = "", id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="block text-left">
        <span className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
          {label}
        </span>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-soft)] ${className}`}
          {...props}
        />
        {hint ? (
          <span className="mt-1 block text-xs text-[var(--text-secondary)]">{hint}</span>
        ) : null}
      </label>
    );
  }
);

Input.displayName = "Input";
