"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[var(--primary)] text-white hover:opacity-90 shadow-sm hover:shadow-md",
      secondary:
        "bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)]/15",
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/40",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
      md: "px-5 py-2.5 text-sm rounded-[var(--radius-md)]",
      lg: "px-8 py-3 text-base rounded-[var(--radius-md)]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
