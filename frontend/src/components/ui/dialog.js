import React, { useState } from "react";
import clsx from "clsx";

function Dialog({ title, children, triggerLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{triggerLabel}</button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className={clsx("bg-white rounded-lg shadow-lg w-full max-w-md p-6", "relative")} onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="mb-4">{children}</div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function DialogTrigger({ children, ...props }) { return <button {...props}>{children}</button>; }
function DialogContent({ children, ...props }) { return <div {...props}>{children}</div>; }
function DialogHeader({ children, ...props }) { return <div {...props}>{children}</div>; }
function DialogTitle({ children, ...props }) { return <h3 {...props}>{children}</h3>; }
function DialogDescription({ children, ...props }) { return <p {...props}>{children}</p>; }

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription };
