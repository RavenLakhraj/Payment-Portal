import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import Alert, { AlertDescription } from '../components/ui/alert';

// Register page
// - Collects user information for account creation (demo uses localStorage)
// - Validates basic presence of fields and prevents duplicate customerId/email
// - Redirects to the customer login page and pre-fills the Customer ID on success
export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', customerId: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update form state on input change
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, customerId, password } = form;

    // Basic client-side validation (presence)
    if (!name || !email || !customerId || !password) {
      setError('Please fill all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Persist to localStorage for demo purposes
      const raw = localStorage.getItem('ads_users');
      const users = raw ? JSON.parse(raw) : [];

      // Prevent duplicates by customer ID or email
      const exists = users.find((u) => u.customerId === customerId || u.email === email);
      if (exists) {
        setError('An account with that Customer ID or Email already exists');
        setIsSubmitting(false);
        return;
      }

      const user = { name, email, customerId, password };
      users.push(user);
      localStorage.setItem('ads_users', JSON.stringify(users));
      localStorage.setItem('ads_lastRegistered', JSON.stringify({ customerId, name }));

      // simulate API delay
      await new Promise((r) => setTimeout(r, 700));

      // Redirect to customer login with prefill param
      router.push(`/customer/login?registered=true&customerId=${encodeURIComponent(customerId)}`);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsSubmitting(false);
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
            <CardTitle className="text-2xl">Register for AdAstra Bank</CardTitle>
            <CardDescription>Create your customer account to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            {/* show error messages */}
            {error && (
              <div className="mb-4">
                <Alert variant="danger"><AlertDescription>{error}</AlertDescription></Alert>
              </div>
            )}

            {/* registration form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input id="customerId" name="customerId" value={form.customerId} onChange={handleChange} placeholder="CUST123456" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" required />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
