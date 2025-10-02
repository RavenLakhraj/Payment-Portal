import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import Alert, { AlertDescription } from '../components/ui/alert';

// Register page - updated per requirements
// - Collects full name, South African ID (13 digits YYMMDDSSSSCAZ), savings account number (8-12 digits), email, password
// - Validates formats and prevents duplicates (by accountNumber or email)
// - Redirects to the customer login page with accountNumber prefill on success
export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', idNumber: '', accountNumber: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateIdNumber = (id) => {
    const digits = String(id || '').replace(/\D/g, '');
    if (!/^\d{13}$/.test(digits)) return false;
    // basic YYMMDD date validation for first 6 digits
    const yy = parseInt(digits.slice(0, 2), 10);
    const mm = parseInt(digits.slice(2, 4), 10);
    const dd = parseInt(digits.slice(4, 6), 10);
    if (mm < 1 || mm > 12) return false;
    if (dd < 1 || dd > 31) return false;
    return true;
  };

  const validateAccountNumber = (acc) => /^\d{8,12}$/.test(acc);
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(p);

  // Update form state on input change
  const formatIdNumberInput = (value) => {
    const digits = String(value).replace(/\D/g, '').slice(0, 13);
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 8);
    const p3 = digits.slice(8, 13);
    return [p1, p2, p3].filter(Boolean).join(' ');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idNumber') {
      const formatted = formatIdNumberInput(value);
      setForm((f) => ({ ...f, idNumber: formatted }));
    } else if (name === 'fullName') {
      // allow spaces while typing; only sanitize harmful characters
      const sanitized = value.replace(/[<>"'&]/g, '');
      setForm((f) => ({ ...f, fullName: sanitized }));
    } else {
      setForm((f) => ({ ...f, [name]: value.trim() }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { fullName, idNumber, accountNumber, email, password } = form;

    // Validate inputs
    if (!fullName || fullName.length < 2) {
      setError('Please enter your full name (2+ characters)');
      return;
    }
    if (!validateIdNumber(idNumber)) {
      setError('Please enter a valid South African ID number (13 digits, YYMMDD...)');
      return;
    }
    if (!validateAccountNumber(accountNumber)) {
      setError('Please enter a valid savings account number (8-12 digits)');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number and special character');
      return;
    }

    setIsSubmitting(true);

    try {
      // Persist to localStorage for demo purposes
      const raw = localStorage.getItem('ads_users');
      const users = raw ? JSON.parse(raw) : [];

      // Prevent duplicates by accountNumber or email
      const exists = users.find((u) => u.accountNumber === accountNumber || u.email === email);
      if (exists) {
        setError('An account with that Account Number or Email already exists');
        setIsSubmitting(false);
        return;
      }

      const user = { fullName, name: fullName, email, accountNumber, idNumber, password };
      users.push(user);
      localStorage.setItem('ads_users', JSON.stringify(users));
      localStorage.setItem('ads_lastRegistered', JSON.stringify({ accountNumber, fullName }));

      // simulate API delay
      await new Promise((r) => setTimeout(r, 700));

      // Redirect to customer login with prefill param
      router.push(`/customer/login?registered=true&accountNumber=${encodeURIComponent(accountNumber)}`);
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
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jane Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">Enter 13 digit ID number</Label>
                <Input id="idNumber" name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="---- ---- -----" maxLength={15} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Savings Account Number</Label>
                <Input id="accountNumber" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="8-12 digit account number" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
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
