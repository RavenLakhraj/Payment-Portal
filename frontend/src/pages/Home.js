
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Building } from "lucide-react";


export default function Home() {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = (name, value) => {
    const patterns = {
      employeeId: /^EMP[0-9]{6}$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };
    if (!patterns[name]?.test(value)) {
      return (
        {
          employeeId: "Employee ID must be in format EMP123456",
          password: "Password must be 8+ characters with uppercase, lowercase, number and special character",
        }[name] || "Invalid input"
      );
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Input sanitization - remove potentially harmful characters
    const sanitizedValue = value.replace(/[<>"'&]/g, "");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    // Real-time validation
    const error = validateInput(name, sanitizedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

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
      localStorage.setItem("authToken", "mock-employee-token");
      console.log("[v0] Employee login successful, token set");
      navigate("/employee/dashboard");
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">SecureBank</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-success">
            <Lock className="h-4 w-4" />
            <span>SSL Secured Connection</span>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
              <Building className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl">Employee Portal</CardTitle>
            <CardDescription>Access the secure transaction management system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="EMP123456"
                  className={errors.employeeId ? "border-destructive" : ""}
                  required
                />
                {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId}</p>}
              </div>

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

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Access Portal"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Are you a customer? "}
                <Link to="/customer/login" className="text-primary hover:underline">
                  Customer Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Employee access is monitored and logged. Unauthorized access attempts will be reported to security.
          </p>
        </div>
      </div>
    </div>
  );
}
