import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import Alert, { AlertDescription } from "../../components/ui/alert";

// Customer Login page
// - Accepts savings account number OR email and password
// - If redirected from registration, shows a success message and pre-fills the identifier
// - Authenticates against demo localStorage user store and redirects to dashboard on success
export default function login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // account number or email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Read query params and try to prefill the identifier if available
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

  // Handle login form submit
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
      <div className="w-full max-w-md">
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
