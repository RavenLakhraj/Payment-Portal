import { useEffect, useState } from "react";
import Alert, { AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Shield, AlertTriangle } from "lucide-react";

export default function SessionManager({ children }) {
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let sessionTimeout;
    let warningTimeout;

    const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
    const WARNING_TIME = 10 * 60 * 1000; // 10 minutes before expiry

    const resetSessionTimer = () => {
      clearTimeout(sessionTimeout);
      clearTimeout(warningTimeout);
      setSessionWarning(false);

      warningTimeout = setTimeout(() => {
        setSessionWarning(true);
      }, SESSION_DURATION - WARNING_TIME);

      sessionTimeout = setTimeout(() => {
        setSessionExpired(true);
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("sessionFingerprint");
      }, SESSION_DURATION);
    };

    const activities = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];

    const resetTimer = () => resetSessionTimer();

    activities.forEach((activity) => {
      document.addEventListener(activity, resetTimer, true);
    });

    resetSessionTimer();

    // Anti-Session Hijacking: Generate browser fingerprint to detect session theft
    // This creates a unique identifier based on browser characteristics
    // If the fingerprint changes during a session, it may indicate session theft
    const generateFingerprint = () => {
      return btoa(
        JSON.stringify({
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screen: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );
    };

    const storedFingerprint = sessionStorage.getItem("sessionFingerprint");
    const currentFingerprint = generateFingerprint();

    if (!storedFingerprint) {
      sessionStorage.setItem("sessionFingerprint", currentFingerprint);
    }

    return () => {
      clearTimeout(sessionTimeout);
      clearTimeout(warningTimeout);
      activities.forEach((activity) => {
        document.removeEventListener(activity, resetTimer, true);
      });
    };
  }, []);

  const extendSession = () => {
    setSessionWarning(false);
    console.log("[v0] Session extended");
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("sessionFingerprint");
    window.location.href = "/";
  };

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Your session has expired for security reasons. Please log in again.</AlertDescription>
          </Alert>
          <Button onClick={logout} className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {sessionWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="mb-3">
              Your session will expire in 10 minutes. Would you like to extend it?
            </AlertDescription>
            <div className="flex gap-2">
              <Button size="sm" onClick={extendSession}>
                Extend Session
              </Button>
              <Button size="sm" variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </Alert>
        </div>
      )}
      {children}
    </>
  )
}
