// ...existing code...
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import Alert, { AlertDescription } from "../../components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Shield, LogOut, Plus, Globe, User, CheckCircle, Clock, XCircle, CreditCard, ArrowRight } from "lucide-react";

export default function dashboard() {
  const [payments, setPayments] = useState([]);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [newPayment, setNewPayment] = useState({
    amount: "",
    currency: "ZAR",
    recipientName: "",
    recipientAccount: "",
    swiftCode: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Load payments from localStorage (remove hardcoded mock data)
  useEffect(() => {
    const tokenRaw = localStorage.getItem("authToken");
    if (!tokenRaw) {
      console.log("[v0] No auth token found, redirecting to login");
      window.location.href = "/customer/login";
      return;
    }

    // try to parse token; if it contains accountNumber, load user info
    try {
      const parsed = JSON.parse(tokenRaw);
      if (parsed && parsed.accountNumber) {
        const usersRaw = localStorage.getItem('ads_users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const found = users.find(u => u.accountNumber === parsed.accountNumber);
        if (found) {
          setUserName(found.name || found.fullName || '');
          setUserAccount(found.accountNumber);
        }
      }
    } catch (e) {
      // token not JSON (maybe a mock string); fallback to lastRegistered
      try {
        const last = localStorage.getItem('ads_lastRegistered');
        if (last) {
          const parsedLast = JSON.parse(last);
          setUserName(parsedLast.fullName || parsedLast.name || '');
          setUserAccount(parsedLast.accountNumber || '');
        }
      } catch (er) {}
    }

    try {
      const raw = localStorage.getItem('ads_payments');
      const stored = raw ? JSON.parse(raw) : [];
      const safeArray = Array.isArray(stored) ? stored : [];
      setPayments(safeArray);
    } catch (err) {
      setPayments([]);
    }
  }, []);



  const validatePaymentInput = (name, value) => {
    const patterns = {
      amount: /^\d+(\.\d{1,2})?$/,
      recipientName: /^[a-zA-Z\s]{2,50}$/,
      recipientAccount: /^[0-9]{8,16}$/,
      swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      description: /^[a-zA-Z0-9\s.,!?-]{5,200}$/,
    };
    if (name === "amount") {
      const numValue = Number.parseFloat(value);
      if (isNaN(numValue) || numValue <= 0 || numValue > 1000000) {
        return "Amount must be between 0.01 and 1,000,000";
      }
    }
    // Allow empty SWIFT (optional) — only validate if provided
    if (name === 'swiftCode' && String(value).trim() === '') return '';

    if (!patterns[name]?.test(value)) {
      return (
        {
          recipientName: "Recipient name must be 2-50 characters, letters and spaces only",
          recipientAccount: "Account number must be 8-16 digits",
          swiftCode: "SWIFT code must be 8 or 11 characters (e.g., ABCDUS33XXX)",
          description: "Description must be 5-200 characters, alphanumeric and basic punctuation only",
        }[name] || "Invalid input"
      );
    }
    return "";
  };

  const handlePaymentInputChange = (name, value) => {
    // Input sanitization
    const sanitizedValue = String(value).replace(/[<>"'&]/g, "");
    setNewPayment((prev) => ({ ...prev, [name]: sanitizedValue }));
    // Real-time validation
    const error = validatePaymentInput(name, sanitizedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate all fields
    const newErrors = {};
    Object.entries(newPayment).forEach(([key, value]) => {
      if (key !== "currency") {
        const error = validatePaymentInput(key, value);
        if (error) newErrors[key] = error;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const payment = {
        id: `PAY${String(payments.length + 1).padStart(3, "0")}`,
        amount: Number.parseFloat(newPayment.amount),
        currency: newPayment.currency,
        recipientName: newPayment.recipientName,
        recipientAccount: newPayment.recipientAccount,
        swiftCode: newPayment.swiftCode,
        status: "pending",
        createdAt: new Date().toISOString(),
        description: newPayment.description,
      };
      setPayments((prev) => {
        const next = [payment, ...prev];
        try { localStorage.setItem('ads_payments', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      setNewPayment({
        amount: "",
        currency: "ZAR",
        recipientName: "",
        recipientAccount: "",
        swiftCode: "",
        description: "",
      });
      setShowNewPayment(false);
      setErrors({});
    } catch (error) {
      setErrors({ general: "Failed to submit payment. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: "secondary", icon: Clock, text: "Pending Review", color: "text-warning" },
      verified: { variant: "default", icon: CheckCircle, text: "Verified", color: "text-success" },
      rejected: { variant: "destructive", icon: XCircle, text: "Rejected", color: "text-destructive" },
      submitted: { variant: "outline", icon: Globe, text: "Submitted to SWIFT", color: "text-primary" },
    };
    const { variant, icon: Icon, text, color } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {text}
      </Badge>
    );
  };

  // previous total (combined) left for reference but we'll show per-currency rotating totals
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const completedCount = payments.filter((p) => p.status === "submitted").length;

  // Compute totals per currency for rotating display
  const totalsByCurrency = payments.reduce((acc, p) => {
    const cur = p.currency || 'ZAR';
    acc[cur] = (acc[cur] || 0) + (Number(p.amount) || 0);
    return acc;
  }, {});
  const currencies = Object.keys(totalsByCurrency).length ? Object.keys(totalsByCurrency) : ['ZAR'];

  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
  const [isRotationPaused, setIsRotationPaused] = useState(false);

  useEffect(() => {
    setCurrentCurrencyIndex(0);
  }, [payments.length]);

  useEffect(() => {
    if (isRotationPaused) return;
    if (currencies.length <= 1) return;
    const id = setInterval(() => {
      setCurrentCurrencyIndex((i) => (i + 1) % currencies.length);
    }, 5000);
    return () => clearInterval(id);
  }, [currencies, isRotationPaused]);

  const currentCurrency = currencies[currentCurrencyIndex] || 'ZAR';
  const currentTotal = totalsByCurrency[currentCurrency] || 0;
  const formatByCurrency = (value, currency) => new Intl.NumberFormat(currency === 'ZAR' ? 'en-ZA' : 'en-US', { style: 'currency', currency }).format(value || 0);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("sessionFingerprint");
    console.log("[v0] User logged out, tokens cleared");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-accent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-black dark:text-on-accent" />
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-on-accent">Customer Portal</h1>
                <p className="text-sm text-black dark:text-on-accent">International Payment Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-black dark:text-on-accent">{userName || 'John Smith'}</p>
                <p className="text-xs text-black dark:text-on-accent">Account: {userAccount || '1234567890'}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-black dark:text-on-accent">
                <LogOut className="h-4 w-4 mr-2 text-black dark:text-on-accent" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card onClick={() => setIsRotationPaused((p) => !p)} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <span className="text-xs font-medium text-muted-foreground">{currentCurrency}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatByCurrency(currentTotal, currentCurrency)}</div>
              <p className="text-xs text-muted-foreground">Showing totals for <strong>{currentCurrency}</strong>. {isRotationPaused ? 'Paused — click to resume' : 'Rotating every 5s — click to pause'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={showNewPayment} onOpenChange={setShowNewPayment}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setShowNewPayment(false)}>Back</Button>
                    </div>
                    <div className="flex-1 text-center">
                      <DialogTitle className="text-lg font-semibold">New International Payment</DialogTitle>
                      <DialogDescription className="text-sm text-muted-foreground">Enter the payment details for international transfer</DialogDescription>
                    </div>
                    <div className="w-16" />
                  </DialogHeader>
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    {errors.general && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.general}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="1000000"
                          value={newPayment.amount}
                          onChange={(e) => handlePaymentInputChange("amount", e.target.value)}
                          placeholder="0.00"
                          className={errors.amount ? "border-destructive" : ""}
                          required
                        />
                        {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={newPayment.currency}
                          onValueChange={(value) => handlePaymentInputChange("currency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input
                        id="recipientName"
                        value={newPayment.recipientName}
                        onChange={(e) => handlePaymentInputChange("recipientName", e.target.value)}
                        placeholder="Enter recipient's full name"
                        className={errors.recipientName ? "border-destructive" : ""}
                        required
                      />
                      {errors.recipientName && <p className="text-sm text-destructive">{errors.recipientName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientAccount">Recipient Account Number</Label>
                      <Input
                        id="recipientAccount"
                        value={newPayment.recipientAccount}
                        onChange={(e) => handlePaymentInputChange("recipientAccount", e.target.value)}
                        placeholder="Enter recipient's account number"
                        className={errors.recipientAccount ? "border-destructive" : ""}
                        required
                      />
                      {errors.recipientAccount && <p className="text-sm text-destructive">{errors.recipientAccount}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="swiftCode">SWIFT Code</Label>
                      <Input
                        id="swiftCode"
                        value={newPayment.swiftCode}
                        onChange={(e) => handlePaymentInputChange("swiftCode", e.target.value.toUpperCase())}
                        placeholder="ABCDUS33XXX"
                        className={errors.swiftCode ? "border-destructive" : ""}
                        maxLength={11}
                      />
                      {errors.swiftCode && <p className="text-sm text-destructive">{errors.swiftCode}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Payment Description</Label>
                      <Textarea
                        id="description"
                        value={newPayment.description}
                        onChange={(e) => handlePaymentInputChange("description", e.target.value)}
                        placeholder="Enter payment description or purpose"
                        className={errors.description ? "border-destructive" : ""}
                        maxLength={200}
                        required
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? "Processing..." : "Submit Payment"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewPayment(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Your Payment Transactions</CardTitle>
              <CardDescription>Track the status of your international payments</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{payment.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()} at{" "}
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center text-2xl font-bold">
                          {formatByCurrency(payment.amount, payment.currency)}
                        </div>
                        <p className="text-sm text-muted-foreground">Payment Amount</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">To:</span>
                          <span className="ml-2">{payment.recipientName}</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">Account:</span>
                          <span className="ml-2 font-mono">{payment.recipientAccount}</span>
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">SWIFT:</span>
                          <span className="ml-2 font-mono">{payment.swiftCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Description:</span> {payment.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {payments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No payments yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first international payment to get started</p>
                    <Button onClick={() => setShowNewPayment(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Payment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-8 bg-accent">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-black dark:text-on-accent">© AdAstra Bank — International Payments</p>
        </div>
      </footer>
    </div>
  )
}
