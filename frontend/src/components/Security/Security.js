
import { createContext, useContext, useEffect, useState } from "react";
import CSPHeader from "./CSPHeader";
import SessionManager from "./SessionManager";

const SecurityContext = createContext({
  isSecure: false,
  sessionActive: false,
  lastActivity: null,
});


export function useSecurityContext() {
  return useContext(SecurityContext);
}


export default function SecurityProvider({ children }) {
  const [isSecure, setIsSecure] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    // Check if connection is secure (HTTPS)
    setIsSecure(window.location.protocol === "https:");

    // Check if user has active session
    const token = localStorage.getItem("authToken");
    setSessionActive(!!token);

    const updateActivity = () => {
      setLastActivity(new Date());
    };

    const activities = ["mousedown", "keypress", "scroll", "touchstart"];
    activities.forEach((activity) => {
      document.addEventListener(activity, updateActivity);
    });

    if (typeof window !== "undefined") {
      // Disable right-click context menu in production
      if (process.env.NODE_ENV === "production") {
        document.addEventListener("contextmenu", (e) => e.preventDefault());
      }

      // Disable text selection for sensitive areas
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    }

    return () => {
      activities.forEach((activity) => {
        document.removeEventListener(activity, updateActivity);
      });
    };
  }, []);

  const contextValue = {
    isSecure,
    sessionActive,
    lastActivity,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      <CSPHeader />
      <SessionManager>{children}</SessionManager>
    </SecurityContext.Provider>
  );
}
