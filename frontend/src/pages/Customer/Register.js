/**
 * Customer Registration Component
 * Allows users to create a secure account for international payments.
 *
 * Features:
 * - Real-time input validation
 * - Password strength indicator
 * - Terms and conditions acceptance
 * - Secure data submission to MongoDB backend
 *
 * @component
 * @returns {JSX.Element} Rendered registration form
 */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Alert, { AlertDescription } from "../../components/ui/alert";
import { Checkbox } from "../../components/ui/checkbox";
import { Shield, Eye, EyeOff, ArrowLeft, Lock, CheckCircle } from "lucide-react";

export default function register() {
  // State management
  /** @state {Object} formData - Stores user input for registration fields */
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  /** @state {boolean} showPassword - Toggles visibility of the password field */
  const [showPassword, setShowPassword] = useState(false);
  /** @state {boolean} showConfirmPassword - Toggles visibility of the confirm password field */
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  /** @state {boolean} acceptTerms - Tracks whether the user has accepted terms and conditions */
  const [acceptTerms, setAcceptTerms] = useState(false);
  /** @state {Object} errors - Stores validation errors for each form field */
  const [errors, setErrors] = useState({});
  /** @state {boolean} isLoading - Indicates whether the form submission is in progress */
  const [isLoading, setIsLoading] = useState(false);
  /** @state {number} passwordStrength - Tracks the strength of the entered password */
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Generate a unique account number
  const generateUniqueAccountNumber = () => {
    let accountNumber;
    let attempts = 0;
    do {
      accountNumber = generateAccountNumber();
      attempts++;
      // In a real app, replace this check with an API call
    } while (existingAccountNumbers.has(accountNumber) && attempts < 100);
    return accountNumber;
  };

  // Set unique account number on mount
  useEffect(() => {
    setFormData((prev) => ({ ...prev, accountNumber: generateUniqueAccountNumber() }));
  }, []);

  /**
   * Validates form input against predefined patterns
   *
   * @param {string} name - Field name to validate (e.g., fullName, idNumber, password)
   * @param {string} value - Input value to validate
   * @returns {string} Error message if validation fails, empty string if valid
   */
  const validateInput = (name, value) => {
    const patterns = {
      fullName: /^[a-zA-Z\s]{2,50}$/,
      idNumber: /^[0-9]{13}$/,
      accountNumber: /^[0-9]{10,16}$/,
      username: /^[a-zA-Z0-9_]{3,20}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };
    if (name === "confirmPassword") {
      return value !== formData.password ? "Passwords do not match" : "";
    }
    if (!patterns[name]?.test(value)) {
      return (
        {
          fullName: "Full name must be 2-50 characters, letters and spaces only",
          idNumber: "ID number must be exactly 13 digits",
          accountNumber: "Account number must be 10-16 digits",
          username: "Username must be 3-20 characters, alphanumeric and underscore only",
          password: "Password must be 8+ characters with uppercase, lowercase, number and special character",
        }[name] || "Invalid input"
      );
    }
    return "";
  };

  /**
   * Calculates the strength of a password based on its composition
   *
   * @param {string} password - The password to evaluate
   * @returns {number} Strength level (0-5) indicating the password's strength
   */
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Input sanitization
    const sanitizedValue = value.replace(/[<>"'&]/g, "");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    // Password strength calculation
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(sanitizedValue));
    }
    // Real-time validation
    const error = validateInput(name, sanitizedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * Handles form submission and uploads user data to MongoDB backend
   *
   * - Validates all form fields
   * - Sends a POST request to the backend API with user data
   * - Navigates to login page on success
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
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      // Send data to backend API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      navigate("/customer/login?registered=true");
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-destructive";
    if (passwordStrength <= 3) return "bg-warning";
    return "bg-success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Back to Home Link */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          {/* Bank Branding */}
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 mr-2" style={{color:'var(--primary)'}} />
            <h1 className="text-2xl font-bold text-foreground">AdAstra Bank</h1>
          </div>
          {/* SSL Security Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm text-success">
            <Lock className="h-4 w-4" />
            <span>SSL Secured Registration</span>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            {/* Registration Form Header */}
            <CardTitle className="text-2xl">Customer Registration</CardTitle>
            <CardDescription>Create your secure international payment account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error Alert */}
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Full Name Input */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? "border-destructive" : ""}
                  required
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              {/* ID Number Input */}
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your 13-digit ID number"
                  className={errors.idNumber ? "border-destructive" : ""}
                  maxLength={13}
                  required
                />
                {errors.idNumber && <p className="text-sm text-destructive">{errors.idNumber}</p>}
              </div>

              {/* Account Number Input */}
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

              {/* Username Input */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  className={errors.username ? "border-destructive" : ""}
                  required
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              {/* Password Input with Strength Indicator */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
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
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{getPasswordStrengthText()}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center text-success text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Passwords match
                  </div>
                )}
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Navigation Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/customer/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {"Are you an employee? "}
                <Link to="/employee/login" className="text-accent hover:underline">
                  Employee Portal
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Your personal information is protected with bank-grade security. All data is encrypted and stored securely.
          </p>
        </div>
      </div>
    </div>
  )
}
//Comments are assisted and expanded on by GitHub Copilot