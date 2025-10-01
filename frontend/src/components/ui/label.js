import React from "react";
import clsx from "clsx";

export function Label({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx("block text-sm font-medium text-gray-700 mb-1", className)}
    >
      {children}
    </label>
  );
}
