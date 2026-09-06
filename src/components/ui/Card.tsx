import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

export function Card({
  className = "",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const pads = {
    sm: "p-3",
    md: "p-5",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-md ${pads[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
