import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import Alert, { AlertDescription } from "../../components/ui/alert";

/**
 * Customer Login Component
 * Provides authentication for bank customers using either account number or email.
 * 
 * Features:
 * - Flexible authentication using account number or email
 * - Integration with registration flow
 * - Success/error message display
 * - Automatic form prefilling from registration
 * - Local storage based authentication (demo purposes)
 * 
 * @component
 * @returns {JSX.Element} Rendered login form with navigation options
 */
export default function login() {
  const router = useRouter();

  // State Management
  /** @state {string} identifier - User's account number or email for authentication */
  const [identifier, setIdentifier] = useState("");
  /** @state {string} password - User's password */
  const [password, setPassword] = useState("");
  /** @state {string} message - Feedback message for user (success/error) */
  const [message, setMessage] = useState("");

  /**
   * Effect to handle form pre-filling and registration success message
   * 
   * - Checks URL parameters for registration status and account number
   * - Sets success message if user just registered
   * - Pre-fills identifier field with account number from URL or localStorage
   * - Depends on router.isReady to ensure query params are available
   */
  useEffect(() => {
    if (!router.isReady) return;
    const { registered, accountNumber: acc } = router.query;
    if (registered) {
      setMessage('Registration successful. Please sign in.');
    }
    if (acc) {
      setIdentifier(String(acc));
    } else {
      // fallback: try to read last registered account from localStorage
      try {
        const last = localStorage.getItem('ads_lastRegistered');
        if (last) {
          const parsed = JSON.parse(last);
          if (parsed.accountNumber) setIdentifier(parsed.accountNumber);
        }
      } catch (e) {}
    }
  }, [router.isReady]);

  /**
   * Handles form submission and user authentication
   * 
   * - Prevents default form submission
   * - Validates credentials against localStorage user store
   * - Sets auth token on successful login
   * - Redirects to dashboard on success
   * - Shows error message on failure
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // simple auth against localStorage users for demo purposes
    try {
      const raw = localStorage.getItem('ads_users');
      const users = raw ? JSON.parse(raw) : [];
      const found = users.find((u) => (u.accountNumber === identifier || u.email === identifier) && u.password === password);
      if (found) {
        // store a simple auth token and redirect
        localStorage.setItem('authToken', JSON.stringify({ type: 'customer', accountNumber: found.accountNumber }));
        router.push('/customer/dashboard');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (err) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Main container - Centered login form with responsive padding */}
      <div className="w-full max-w-md">
        {/* Back Navigation Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </button>
        </div>
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">AdAstra Bank - Customer Portal</CardTitle>
            <CardDescription>Login to access your account and make payments</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div className="mb-4">
                <Alert variant={message === 'Registration successful. Please sign in.' ? 'success' : 'danger'}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </div>
            )}
            {/* Login Form - Handles user authentication */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Account Number or Email</Label>
                <Input id="identifier" name="identifier" type="text" placeholder="account number or email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" style={{backgroundColor:'var(--primary)', color:'var(--on-accent)'}}>Login</Button>
            </form>
            {/* Additional Navigation Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                {"Are you an employee? "}
                <Link href="/employee/login" className="text-primary hover:underline">
                  Employee Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

//Comments are assisted and expanded on by GitHub Copilot