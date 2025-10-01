import React from "react";
import clsx from "clsx";

function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "bg-white shadow-md rounded-lg border border-gray-200 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
function CardHeader({ children }) { return <div className="mb-2 font-semibold text-lg">{children}</div>; }
function CardTitle({ children }) { return <h2 className="text-xl font-bold mb-2">{children}</h2>; }
function CardDescription({ children }) { return <p className="text-gray-600 mb-2">{children}</p>; }
function CardContent({ children }) { return <div>{children}</div>; }

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
