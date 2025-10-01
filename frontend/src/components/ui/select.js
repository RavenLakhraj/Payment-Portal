import React, { createContext, useContext } from "react";
import clsx from "clsx";

const SelectContext = createContext({ value: undefined, onValueChange: () => {} });

function Select({ className, children, value, onValueChange }) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div className={clsx("w-full", className)}>{children}</div>
    </SelectContext.Provider>
  );
}
function SelectContent({ children, className, ...props }) {
  return (
    <div className={clsx("mt-2 bg-white rounded shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
function SelectItem({ children, value, className, ...props }) {
  const ctx = useContext(SelectContext);
  const isSelected = ctx.value === value;
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => ctx.onValueChange && ctx.onValueChange(value)}
      className={clsx("px-3 py-2 cursor-pointer hover:bg-gray-100", isSelected && "bg-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}
function SelectTrigger({ children, className, ...props }) {
  return (
    <div className={clsx("w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white", className)} {...props}>
      {children}
    </div>
  );
}
function SelectValue({ children, placeholder, className, ...props }) {
  const ctx = useContext(SelectContext);
  return (
    <div className={clsx("text-sm", className)} {...props}>
      {children || ctx?.value || placeholder}
    </div>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
