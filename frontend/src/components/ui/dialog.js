import React, { createContext, useState, useContext } from "react";
import clsx from "clsx";

// DialogContext: provides open state and onOpenChange
const DialogContext = createContext(null);

// Dialog: supports controlled (open,onOpenChange) or uncontrolled usage
function Dialog({ open: openProp, onOpenChange, children }) {
  const [openState, setOpenState] = useState(false);
  const isControlled = typeof openProp !== "undefined";
  const open = isControlled ? openProp : openState;
  const setOpen = (v) => {
    if (isControlled) {
      onOpenChange && onOpenChange(v);
    } else {
      setOpenState(v);
    }
  };

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, asChild = false, ...props }) {
  const ctx = useContext(DialogContext);
  const handleOpen = () => ctx && ctx.onOpenChange && ctx.onOpenChange(true);

  if (asChild && React.isValidElement(children)) {
    // Merge onClick with existing child's onClick
    const childOnClick = children.props.onClick;
    const merged = (e) => {
      childOnClick && childOnClick(e);
      handleOpen();
    };
    const childProps = { ...props, onClick: merged };
    delete childProps.asChild;
    return React.cloneElement(children, childProps);
  }

  const filtered = { ...props };
  delete filtered.asChild;
  return (
    <button {...filtered} onClick={handleOpen}>
      {children}
    </button>
  );
}

function DialogContent({ children, className, ...props }) {
  const ctx = useContext(DialogContext);
  if (!ctx || !ctx.open) return null;
  return (
    <div className={clsx("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", className)} onClick={() => ctx.onOpenChange(false)} {...props}>
      <div className="rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto card" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--card-bg)" }}>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
function DialogTitle({ children, ...props }) {
  return <h3 {...props}>{children}</h3>;
}
function DialogDescription({ children, ...props }) {
  return <p {...props}>{children}</p>;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
