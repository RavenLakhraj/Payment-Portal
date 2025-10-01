import React from "react";
import clsx from "clsx";

// Button: reusable button with variants and sizes
// - uses semantic variant mapping so theme tokens can be applied globally
// - forwards other props to the native button element
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-[var(--primary)] text-[var(--on-accent)] hover:brightness-90 focus:ring-[var(--primary)]",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-400",
    ghost: "bg-transparent text-[var(--primary)] hover:bg-[rgba(0,0,0,0.04)] focus:ring-[var(--primary)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
