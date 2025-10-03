import React from "react";
import clsx from "clsx";

function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "card shadow-md rounded-lg border p-4",
        className
      )}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--card-foreground)' }}
      {...props}
    >
      {children}
    </div>
  );
}
function CardHeader({ children, className, ...props }) { return <div className={clsx("mb-2 font-semibold text-lg text-card-foreground", className)} {...props}>{children}</div>; }
function CardTitle({ children, className, ...props }) { return <h2 className={clsx("text-xl font-bold mb-2 text-card-foreground", className)} {...props}>{children}</h2>; }
function CardDescription({ children, className, ...props }) { return <p className={clsx("mb-2 text-muted-foreground", className)} style={{color:'var(--muted)'}} {...props}>{children}</p>; }
function CardContent({ children, className, ...props }) { return <div className={className} {...props}>{children}</div>; }

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
