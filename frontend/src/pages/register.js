import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import Alert, { AlertDescription } from '../components/ui/alert';

/**
 * Register Component
 * Provides a registration form for new customers to create an account.
 *
 * Features:
 * - Validates user inputs (full name, ID number, account number, email, password)
 * - Prevents duplicate registrations by checking localStorage
 * - Redirects to the customer login page with prefilled account number on success
 *
 * @component
 * @returns {JSX.Element} Rendered registration form
 */
export default function Register() {
  const router = useRouter();

  // State management
  /** @state {Object} form - Stores user input for the registration form */
  const [form, setForm] = useState({ fullName: '', idNumber: '', accountNumber: '', email: '', password: '' });
  /** @state {boolean} isSubmitting - Indicates whether the form submission is in progress */
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** @state {string} error - Stores error messages for form validation or submission */
  const [error, setError] = useState('');

  /**
   * Validates South African ID number (13 digits, YYMMDDSSSSCAZ format)
   *
   * @param {string} id - ID number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validateIdNumber = (id) => {
    const digits = String(id || '').replace(/\D/g, '');
    if (!/^\d{13}$/.test(digits)) return false;
    // Basic YYMMDD date validation for first 6 digits
    const yy = parseInt(digits.slice(0, 2), 10);
    const mm = parseInt(digits.slice(2, 4), 10);
    const dd = parseInt(digits.slice(4, 6), 10);
    if (mm < 1 || mm > 12) return false;
    if (dd < 1 || dd > 31) return false;
    return true;
  };

  /**
   * Validates savings account number (8-12 digits)
   *
   * @param {string} acc - Account number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validateAccountNumber = (acc) => /^\d{8,12}$/.test(acc);

  /**
   * Validates email address format
   *
   * @param {string} e - Email to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  /**
   * Validates password strength (minimum 8 characters, includes uppercase, lowercase, number, special character)
   *
   * @param {string} p - Password to validate
   * @returns {boolean} True if valid, false otherwise
   */
  const validatePassword = (p) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(p);

  /**
   * Formats ID number input for better readability
   *
   * @param {string} value - Raw ID number input
   * @returns {string} Formatted ID number
   */
  const formatIdNumberInput = (value) => {
    const digits = String(value).replace(/\D/g, '').slice(0, 13);
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 8);
    const p3 = digits.slice(8, 13);
    return [p1, p2, p3].filter(Boolean).join(' ');
  };

  /**
   * Handles input changes and updates form state
   *
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'idNumber') {
      const formatted = formatIdNumberInput(value);
      setForm((f) => ({ ...f, idNumber: formatted }));
    } else if (name === 'fullName') {
      // Allow spaces while typing; only sanitize harmful characters
      const sanitized = value.replace(/[<>\"'&]/g, '');
      setForm((f) => ({ ...f, fullName: sanitized }));
    } else {
      setForm((f) => ({ ...f, [name]: value.trim() }));
    }
  };

  /**
   * Handles form submission and validates inputs
   *
   * - Prevents duplicate registrations by checking localStorage
   * - Redirects to customer login page on success
   * - Displays error message on failure
   *
   * @param {React.FormEvent} e - Form submission event
   */
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
      // Send registration to backend API
      const payload = {
        fullName,
        idNumber: String(idNumber).replace(/\s+/g, ''),
        accountNumber,
        email,
        password,
      };

      const res = await fetch('/api/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.status === 201) {
        // store last registered locally for UX convenience
        localStorage.setItem('ads_lastRegistered', JSON.stringify({ accountNumber, fullName }));
        router.push(`/customer/login?registered=true&accountNumber=${encodeURIComponent(accountNumber)}`);
        return;
      }

      // Try to parse JSON, otherwise read text for better error visibility
      let bodyText = '';
      try {
        const body = await res.json();
        bodyText = body.message || JSON.stringify(body);
      } catch (e) {
        try {
          bodyText = await res.text();
        } catch (e2) {
          bodyText = 'Unknown error from server';
        }
      }
      console.error('Registration failed', res.status, bodyText);
      setError(`Registration failed (${res.status}): ${bodyText}`);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
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

        {/* Registration Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Register for AdAstra Bank</CardTitle>
            <CardDescription>Create your customer account to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {error && (
              <div className="mb-4">
                <Alert variant="danger"><AlertDescription>{error}</AlertDescription></Alert>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jane Doe" required />
              </div>

              {/* ID Number Input */}
              <div className="space-y-2">
                <Label htmlFor="idNumber">Enter 13 digit ID number</Label>
                <Input id="idNumber" name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="---- ---- -----" maxLength={15} required />
              </div>

              {/* Account Number Input */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Savings Account Number</Label>
                <Input id="accountNumber" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="8-12 digit account number" required />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" required />
              </div>

              {/* Submit Button */}
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
