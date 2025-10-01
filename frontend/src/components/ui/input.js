import React from "react";
import clsx from "clsx";

// Input: lightweight wrapper around <input>
// - forwards props to the native input element
// - applies consistent spacing, border and focus styles
export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
        "focus:outline-none focus:ring-2 focus:border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{ ['--tw-ring-color']: 'var(--primary)' }}
      {...props}
    />
  );
}
