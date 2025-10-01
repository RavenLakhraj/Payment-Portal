import React from "react";
import clsx from "clsx";

export function Checkbox({ label, className, ...props }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        className={clsx(
          "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
          className
        )}
        {...props}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}
