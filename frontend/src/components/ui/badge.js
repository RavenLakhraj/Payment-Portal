import React from "react";
import clsx from "clsx";

export default function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={clsx(
        "px-2 inline-flex text-xs font-semibold rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
