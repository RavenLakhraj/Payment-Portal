import React, { useState } from "react";
import Link from "next/link";

/**
 * Employee Login Component
 * Provides a secure login interface for employees to access the transaction management system.
 *
 * Features:
 * - Validates email and password formats
 * - Simulates API call for authentication
 * - Stores mock token in localStorage on successful login
 * - Redirects to employee dashboard
 *
 * @component
 * @returns {JSX.Element} Rendered employee login form
 */
export default function EmployeeLogin() {
  // State management
  /** @state {Object} formData - Stores email and password input */
  const [formData, setFormData] = useState({ email: "", password: "" });
  /** @state {boolean} showPassword - Toggles visibility of the password field */
  const [showPassword, setShowPassword] = useState(false);
  /** @state {Object} errors - Stores validation errors for email and password */
  const [errors, setErrors] = useState({});
  /** @state {boolean} isLoading - Indicates whether the form submission is in progress */
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Validates form input against predefined patterns
   *
   * @param {string} name - Field name to validate (email or password)
   * @param {string} value - Input value to validate
   * @returns {string} Error message if validation fails, empty string if valid
   */
  const validateInput = (name, value) => {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };
    if (!patterns[name]?.test(value)) {
      return {
        email: "Please enter a valid company email address",
        password: "Password must be 8+ characters with uppercase, lowercase, number and special character",
      }[name];
    }
    return "";
  };

  /**
   * Handles input changes and performs real-time validation
   *
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/[<>\"'&]/g, ""); // sanitize
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrors((prev) => ({ ...prev, [name]: validateInput(name, sanitizedValue) }));
  };

  /**
   * Handles form submission and simulates API call for authentication
   *
   * - Validates all fields
   * - Checks credentials against mock employee data in localStorage
   * - Stores mock token in localStorage on success
   * - Redirects to employee dashboard
   * - Displays error message on failure
   *
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateInput(key, value);
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Check against stored employees in localStorage
      const raw = localStorage.getItem('ads_employees');
      const employees = raw ? JSON.parse(raw) : [];
      const found = employees.find((u) => u.email === formData.email && u.password === formData.password);
      await new Promise((resolve) => setTimeout(resolve, 800)); // mock API
      if (found) {
        localStorage.setItem('authToken', JSON.stringify({ type: 'employee', email: found.email }));
        router.push('/employee/dashboard');
      } else {
        setErrors({ general: 'Invalid credentials' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Back to Home Link */}
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
          </Link>
          {/* Bank Branding */}
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 mr-2" style={{color:'var(--primary)'}} />
            <h1 className="text-2xl font-bold text-foreground">AdAstra Bank</h1>
          </div>
          {/* SSL Security Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm text-success">
            <Lock className="h-4 w-4" /> <span>SSL Secured Connection</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            {/* Employee Portal Icon */}
            <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
              <Building className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Employee Portal</CardTitle>
            <CardDescription>Access the secure transaction management system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error Alert */}
              {errors.general && (
                <Alert variant="destructive"><AlertDescription>{errors.general}</AlertDescription></Alert>
              )}

              {/* Employee Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Employee Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className={errors.email ? "border-destructive" : ""}
                  required
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading} style={{backgroundColor:'var(--primary)', color:'var(--on-accent)'}}>
                {isLoading ? "Signing In..." : "Access Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
//Comments are assisted and expanded on by GitHub Copilot