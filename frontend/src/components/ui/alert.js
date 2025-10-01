import React from "react";
import clsx from "clsx";

export default function Alert({ children, variant = "info", className }) {
  const variants = {
    info: "bg-blue-50 border-blue-400 text-blue-800",
    success: "bg-green-50 border-green-400 text-green-800",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
    danger: "bg-red-50 border-red-400 text-red-800",
  };

  return (
    <div
      className={clsx(
        "w-full border-l-4 p-4 rounded-md",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
export function AlertDescription({ children, ...props }) { return <div {...props}>{children}</div>; }
