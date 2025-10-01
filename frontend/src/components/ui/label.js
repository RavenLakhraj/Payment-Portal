import React from "react";
import clsx from "clsx";

// Label: simple label element used across forms
// - ensures consistent typography and spacing
export function Label({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx("block text-sm font-medium mb-1 text-foreground", className)}
    >
      {children}
    </label>
  );
}
