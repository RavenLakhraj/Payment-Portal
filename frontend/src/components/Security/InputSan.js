
import { useState, useCallback } from "react";

export function useSanitizedInput(
  initialValue = "",
  validationPattern,
  errorMessage
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const onChange = useCallback(
    (e) => {
      let sanitizedValue = e.target.value;
      // Remove potentially dangerous characters
      sanitizedValue = sanitizedValue
        .replace(/[<>]/g, "") // Remove angle brackets
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+=/gi, "") // Remove event handlers
        .replace(/script/gi, "") // Remove script tags
        .replace(/['"]/g, "") // Remove quotes that could break out of attributes
        .replace(/&/g, "&amp;") // Escape ampersands
        .replace(/\\/g, ""); // Remove backslashes

      // Additional SQL injection prevention
      const sqlKeywords = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi;
      sanitizedValue = sanitizedValue.replace(sqlKeywords, "");

      setValue(sanitizedValue);

      // Validation
      if (validationPattern && !validationPattern.test(sanitizedValue)) {
        setError(errorMessage || "Invalid input format");
      } else {
        setError("");
      }
    },
    [validationPattern, errorMessage]
  );

  return { value, onChange, error };
}

export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/script/gi, "")
    .replace(/['"]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/\\/g, "")
    .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, "");
}

export const securePatterns = {
  username: /^[a-zA-Z0-9_]{3,20}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  accountNumber: /^[0-9]{10,16}$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  amount: /^\d+(\.\d{1,2})?$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  description: /^[a-zA-Z0-9\s.,!?-]{5,200}$/,
  employeeId: /^EMP[0-9]{6}$/,
  idNumber: /^[0-9]{13}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
