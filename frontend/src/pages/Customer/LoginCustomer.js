import '../../../App.css';  // contains @tailwind directives
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Alert, { AlertDescription } from "../../components/ui/alert";
import { Shield, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";

/**
 * Customer Login Component
 * Provides secure authentication for bank customers with real-time validation.
 *
 * Features:
 * - Real-time input validation
 * - Input sanitization for security
 * - Password visibility toggle
 * - Loading state handling
 * - Error messaging
 * - SSL security indicator
 *
 * @component
 * @returns {JSX.Element} Secure customer login form
 */
export default function logincustomer() {
  // Form state management
  /** @state {Object} Form data containing username, account number, and password */
  const [formData, setFormData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });
  /** @state {boolean} Controls password visibility toggle */
  const [showPassword, setShowPassword] = useState(false);
  /** @state {Object} Stores validation errors for each form field */
  const [errors, setErrors] = useState({});
  /** @state {boolean} Indicates form submission in progress */
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Validates form input against predefined patterns
   * 
   * @param {string} name - Field name to validate (username/accountNumber/password)
   * @param {string} value - Input value to validate
   * @returns {string} Error message if validation fails, empty string if valid
   */
  const validateInput = (name, value) => {
    // Regular expressions for input validation
    /** @const {Object} Validation patterns for form fields
     *  username: 3-20 chars, alphanumeric + underscore
     *  accountNumber: 10-16 digits
     *  password: 8+ chars, must include upper, lower, number, special
     */
    const patterns = {
      username: /^[a-zA-Z0-9_]{3,20}$/,
      accountNumber: /^[0-9]{10,16}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };
    if (!patterns[name]?.test(value)) {
      return (
        {
          username: "Username must be 3-20 characters, alphanumeric and underscore only",
          accountNumber: "Account number must be 10-16 digits",
          password: "Password must be 8+ characters with uppercase, lowercase, number and special character",
        }[name] || "Invalid input"
      );
    }
    return "";
  };

  /**
   * Handles form input changes with sanitization and validation
   * 
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Input sanitization - remove potentially harmful characters
    const sanitizedValue = value.replace(/[<>"'&]/g, "");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    // Real-time validation
    const error = validateInput(name, sanitizedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * Handles form submission with validation and authentication
   * 
   * - Prevents default form submission
   * - Validates all form fields
   * - Shows loading state during authentication
   * - Handles authentication response
   * - Redirects on success
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      localStorage.setItem("authToken", "mock-customer-token");
      console.log("[v0] Customer login successful, token set");
      navigate("/customer/dashboard");
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Main container with max width for readability */}
      <div className="w-full max-w-md">
        {/* Bank branding and security indicator */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 mr-2" style={{color:'var(--primary)'}} />
            <h1 className="text-2xl font-bold text-foreground">AdAstra Bank</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-success">
            <Lock className="h-4 w-4" />
            <span>SSL Secured Connection</span>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Customer Login</CardTitle>
            <CardDescription>Access your secure international payment account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Username input field with validation */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className={errors.username ? "border-destructive" : ""}
                  required
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your account number"
                  className={errors.accountNumber ? "border-destructive" : ""}
                  required
                />
                {errors.accountNumber && <p className="text-sm text-destructive">{errors.accountNumber}</p>}
              </div>

              {/* Password input with visibility toggle */}
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Registration and alternative login links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link to="/customer/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {"Are you an employee? "}
                <Link to="/employee/login" className="text-accent hover:underline">
                  Employee Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Your connection is secured with 256-bit SSL encryption. Never share your login credentials with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}
//Comments are assisted and expanded on by GitHub Copilot