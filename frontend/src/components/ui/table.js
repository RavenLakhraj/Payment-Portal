import React from "react";
import clsx from "clsx";

export default function Table({ headers = [], rows = [], className }) {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          "min-w-full border border-gray-200 rounded-md shadow-sm",
          "divide-y divide-gray-200 text-sm",
          className
        )}
      >
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-left font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-2 text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
