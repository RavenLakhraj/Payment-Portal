import React, { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";
import { Alert, AlertDescription } from "./alert";
import { currencies, swiftProviders } from "./mock-data";
import { Shield, CreditCard, Globe, CheckCircle } from "lucide-react";

export function PaymentForm({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    amount: "",
    currency: "",
    provider: "",
    recipientName: "",
    recipientAccount: "",
    swiftCode: "",
    description: "",
  })
  const [errors, setErrors] = useState({})

  // Input validation patterns
  const patterns = {
    amount: /^\d+(\.\d{1,2})?$/,
    recipientName: /^[a-zA-Z\s\-'.]{2,100}$/,
    recipientAccount: /^[A-Z0-9]{8,34}$/,
    swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
    description: /^[a-zA-Z0-9\s\-'.]{2,200}$/,
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "amount":
        if (!patterns.amount.test(value) || Number.parseFloat(value) <= 0) {
          newErrors.amount = "Please enter a valid amount (e.g., 1000.50)";
        } else {
          delete newErrors.amount;
        }
        break;
      case "recipientName":
        if (!patterns.recipientName.test(value)) {
          newErrors.recipientName = "Name must contain only letters, spaces, hyphens, apostrophes, and periods";
        } else {
          delete newErrors.recipientName;
        }
        break;
      case "recipientAccount":
        if (!patterns.recipientAccount.test(value)) {
          newErrors.recipientAccount = "Account number must be 8-34 alphanumeric characters";
        } else {
          delete newErrors.recipientAccount;
        }
        break;
      case "swiftCode":
        if (!patterns.swiftCode.test(value)) {
          newErrors.swiftCode = "SWIFT code must be 8 or 11 characters (e.g., NWBKGB2L)";
        } else {
          delete newErrors.swiftCode;
        }
        break;
      case "description":
        if (!patterns.description.test(value)) {
          newErrors.description = "Description contains invalid characters";
        } else {
          delete newErrors.description;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleInputChange = (name, value) => {
    // Sanitize input to prevent XSS
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    validateField(name, sanitizedValue);
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1 fields
      const step1Fields = ["amount", "currency", "provider"];
      let hasErrors = false;
      step1Fields.forEach((field) => {
        if (!formData[field]) {
          setErrors((prev) => ({ ...prev, [field]: "This field is required" }));
          hasErrors = true;
        }
      });
      if (!hasErrors && formData.amount) {
        validateField("amount", formData.amount);
        if (!errors.amount) {
          setStep(2);
        }
      }
    } else if (step === 2) {
      // Validate step 2 fields
      const step2Fields = ["recipientName", "recipientAccount", "swiftCode"];
      let hasErrors = false;
      step2Fields.forEach((field) => {
        const value = formData[field];
        if (!value) {
          setErrors((prev) => ({ ...prev, [field]: "This field is required" }));
          hasErrors = true;
        } else {
          validateField(field, value);
        }
      });
      if (!hasErrors && Object.keys(errors).length === 0) {
        setStep(3);
      }
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        ...formData,
        id: `PAY${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }
    // Reset form
    setFormData({
      amount: "",
      currency: "",
      provider: "",
      recipientName: "",
      recipientAccount: "",
      swiftCode: "",
      description: "",
    });
    setStep(1);
    setErrors({});
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          International Payment
        </CardTitle>
        <CardDescription>
          Step {step} of 3: {step === 1 ? "Payment Details" : step === 2 ? "Recipient Information" : "Review & Submit"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className={errors.amount ? "border-destructive" : ""}
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && <p className="text-sm text-destructive">{errors.currency}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Payment Provider *</Label>
              <Select value={formData.provider} onValueChange={(value) => handleInputChange("provider", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {swiftProviders.map((provider) => (
                    <SelectItem key={provider.code} value={provider.code}>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-muted-foreground">{provider.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provider && <p className="text-sm text-destructive">{errors.provider}</p>}
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All payment information is encrypted and processed through secure channels.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="Full name or company name"
                value={formData.recipientName}
                onChange={(e) => handleInputChange("recipientName", e.target.value)}
                className={errors.recipientName ? "border-destructive" : ""}
              />
              {errors.recipientName && <p className="text-sm text-destructive">{errors.recipientName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientAccount">Recipient Account Number *</Label>
              <Input
                id="recipientAccount"
                type="text"
                placeholder="IBAN or account number"
                value={formData.recipientAccount}
                onChange={(e) => handleInputChange("recipientAccount", e.target.value.toUpperCase())}
                className={errors.recipientAccount ? "border-destructive" : ""}
              />
              {errors.recipientAccount && <p className="text-sm text-destructive">{errors.recipientAccount}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="swiftCode">SWIFT Code *</Label>
              <Input
                id="swiftCode"
                type="text"
                placeholder="e.g., NWBKGB2L"
                value={formData.swiftCode}
                onChange={(e) => handleInputChange("swiftCode", e.target.value.toUpperCase())}
                className={errors.swiftCode ? "border-destructive" : ""}
              />
              {errors.swiftCode && <p className="text-sm text-destructive">{errors.swiftCode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Payment Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for this payment"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                Please verify all recipient details carefully. International transfers cannot be easily reversed.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold">Payment Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Amount:</div>
                <div className="font-medium">
                  {currencies.find((c) => c.code === formData.currency)?.symbol}
                  {formData.amount} {formData.currency}
                </div>
                <div>Provider:</div>
                <div>{swiftProviders.find((p) => p.code === formData.provider)?.name}</div>
                <div>Recipient:</div>
                <div>{formData.recipientName}</div>
                <div>Account:</div>
                <div className="font-mono text-xs">{formData.recipientAccount}</div>
                <div>SWIFT Code:</div>
                <div className="font-mono">{formData.swiftCode}</div>
                {formData.description && (
                  <>
                    <div>Description:</div>
                    <div>{formData.description}</div>
                  </>
                )}
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                By clicking "Submit Payment", you authorize this international transfer. The payment will be reviewed by
                our team before processing.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-primary">
                Submit Payment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
