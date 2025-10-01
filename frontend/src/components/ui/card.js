import React from "react";
import clsx from "clsx";

function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "card shadow-md rounded-lg border p-4",
        className
      )}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--card-foreground)' }}
    >
      {children}
    </div>
  );
}
function CardHeader({ children }) { return <div className="mb-2 font-semibold text-lg text-card-foreground">{children}</div>; }
function CardTitle({ children }) { return <h2 className="text-xl font-bold mb-2 text-card-foreground">{children}</h2>; }
function CardDescription({ children }) { return <p className="mb-2 text-muted-foreground" style={{color:'var(--muted)'}}>{children}</p>; }
function CardContent({ children }) { return <div>{children}</div>; }

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
