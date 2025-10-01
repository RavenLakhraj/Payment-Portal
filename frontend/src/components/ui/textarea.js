import React from "react";
import clsx from "clsx";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={clsx(
        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "resize-y min-h-[100px]",
        className
      )}
      {...props}
    />
  );
}
