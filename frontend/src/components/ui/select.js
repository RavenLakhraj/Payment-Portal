import React from "react";
import clsx from "clsx";

function Select({ className, children, ...props }) {
  return (
    <select
      className={clsx(
        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
function SelectContent({ children, ...props }) { return <div {...props}>{children}</div>; }
function SelectItem({ children, ...props }) { return <option {...props}>{children}</option>; }
function SelectTrigger({ children, ...props }) { return <div {...props}>{children}</div>; }
function SelectValue({ children, ...props }) { return <div {...props}>{children}</div>; }

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
