import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Shield, LogOut, Search, CheckCircle, XCircle, Clock, Globe, User, AlertTriangle } from "lucide-react";

export default function dashboard() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Currency handling
  const [baseCurrency, setBaseCurrency] = useState("ZAR");
  const [rates, setRates] = useState(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);

  // Fetch free real-time forex rates (exchangerate.host - no API key required)
  // Resilient implementation: timeout + limited retries + graceful failure to avoid uncaught errors
  const [ratesError, setRatesError] = useState(null);
  useEffect(() => {
    let active = true;
    let attempts = 0;
    const maxAttempts = 3;

    const fetchRatesWithRetry = async () => {
      attempts += 1;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
      try {
        const res = await fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`Failed fetching rates (${res.status})`);
        const data = await res.json();
        if (active) {
          setRates(data.rates || null);
          setRatesUpdatedAt(data.date || new Date().toISOString());
          setRatesError(null);
        }
      } catch (err) {
        clearTimeout(timeout);
        // Network errors (CORS, offline) can happen in dev; handle silently and retry a few times
        if (active) {
          console.warn("FX rates fetch error", err && err.message ? err.message : err);
          if (attempts < maxAttempts) {
            // exponential backoff
            const delay = 1000 * Math.pow(2, attempts);
            setTimeout(fetchRatesWithRetry, delay);
          } else {
            setRates(null);
            setRatesError(err && err.message ? err.message : String(err));
          }
        }
      }
    };

    fetchRatesWithRetry();
    const id = setInterval(() => {
      // only schedule a fresh fetch if we don't currently have an error
      if (!ratesError) fetchRatesWithRetry();
    }, 1000 * 60 * 30); // refresh every 30 minutes

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [baseCurrency]);

  // convertAmount: Convert an amount from one currency to another using fetched rates.
  // - amount: numeric value in `from` currency
  // - from: currency code of the provided amount (e.g. 'USD')
  // - to: target currency code (e.g. baseCurrency 'ZAR')
  // Returns the converted numeric value, or null when rates are not yet available.
  const convertAmount = (amount, from, to) => {
    if (!amount || !from || !to) return 0;
    if (from === to) return amount;
    if (!rates) return null; // rates not available yet

    // rates map is quoted as: 1 baseCurrency = rates[CUR] CUR
    // To convert `amount` from `from` -> `to`, first express it relative to the base currency,
    // then multiply by the target rate.
    const rateFrom = rates[from];
    if (!rateFrom) return null;
    const inBase = amount / rateFrom;
    if (to === baseCurrency) return inBase;
    const rateTo = rates[to];
    if (!rateTo) return null;
    return inBase * rateTo;
  };

  // Load payments from localStorage (employees should see all customer-created payments)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ads_payments');
      const stored = raw ? JSON.parse(raw) : null;
      if (Array.isArray(stored) && stored.length > 0) {
        setPayments(stored);
        setFilteredPayments(stored);
        return;
      }
    } catch (e) {
      // ignore
    }

    // fallback sample data if none present
    const mockPayments = [
      {
        id: "PAY001",
        customerName: "John Smith",
        accountNumber: "1234567890",
        amount: 5000,
        currency: "USD",
        recipientName: "Jane Doe",
        recipientAccount: "9876543210",
        swiftCode: "ABCDUS33XXX",
        status: "pending",
        createdAt: "2025-01-15T10:30:00Z",
        description: "Business payment for services",
      },
    ];
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  }, []);

  // Filter payments based on search and status
  useEffect(() => {
    let filtered = payments

    const q = (searchTerm || "").toLowerCase().trim();
    if (q) {
      filtered = filtered.filter((payment) => {
        if (!payment) return false;
        const name = String(payment.customerName || "").toLowerCase();
        const id = String(payment.id || "").toLowerCase();
        const rec = String(payment.recipientName || "").toLowerCase();
        return name.includes(q) || id.includes(q) || rec.includes(q);
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment && payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [payments, searchTerm, statusFilter])

  // Approve payment (do NOT mark as 'verified' — verification happens on SWIFT submission)
  const handleVerifyPayment = async (paymentId) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const updated = payments.map((payment) => (payment.id === paymentId ? { ...payment, status: 'approved' } : payment));
      setPayments(updated);
      setFilteredPayments(updated);
      try { localStorage.setItem('ads_payments', JSON.stringify(updated)); } catch (e) {}
    } catch (error) {
      console.error("Failed to approve payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectPayment = async (paymentId, reason) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const updated = payments.map((payment) => (payment.id === paymentId ? { ...payment, status: 'rejected' } : payment));
      setPayments(updated);
      setFilteredPayments(updated);
      try { localStorage.setItem('ads_payments', JSON.stringify(updated)); } catch (e) {}
      setRejectionReason('')
      setSelectedPayment(null)
    } catch (error) {
      console.error("Failed to reject payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitToSwift = async () => {
    if (!payments || payments.length === 0) return

    setIsLoading(true)
    try {
      // Submit approved payments directly to 'submitted' without intermediate 'verified' state
      // Keep a local snapshot so we persist correctly after the simulated API call
      const toSubmitIds = payments.filter((p) => p.status === 'approved').map(p => p.id);
      if (toSubmitIds.length === 0) {
        setIsLoading(false);
        return;
      }

      // Immediately increment cumulative verified counter so the Verified card reflects the new total
      setCumulativeVerified((prev) => {
        const next = (prev || 0) + toSubmitIds.length;
        try { localStorage.setItem('ads_cumulative_verified', String(next)); } catch (e) {}
        return next;
      });

      // Optionally: mark locally as 'submitting' to reflect in UI during operation
      const submittingSnapshot = payments.map((p) => (toSubmitIds.includes(p.id) ? { ...p, status: 'submitting' } : p));
      setPayments(submittingSnapshot);
      setFilteredPayments(submittingSnapshot);
      try { localStorage.setItem('ads_payments', JSON.stringify(submittingSnapshot)); } catch (e) {}

      // Simulate API submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After successful submission, mark as 'submitted'
      const updated = submittingSnapshot.map((payment) => (toSubmitIds.includes(payment.id) ? { ...payment, status: 'submitted' } : payment));
      setPayments(updated);
      setFilteredPayments(updated);
      try { localStorage.setItem('ads_payments', JSON.stringify(updated)); } catch (e) {}
    } catch (error) {
      console.error("Failed to submit to SWIFT:", error)
    } finally {
      setIsLoading(false)
    }
  }


  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: "secondary", icon: Clock, text: "Pending Review" },
      approved: { variant: "secondary", icon: CheckCircle, text: "Approved" },
      verified: { variant: "default", icon: CheckCircle, text: "Verified" },
      rejected: { variant: "destructive", icon: XCircle, text: "Rejected" },
      submitted: { variant: "outline", icon: Globe, text: "Submitted to SWIFT" },
    };
    const { variant, icon: Icon, text } = variants[status] || variants.pending;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    );
  };

  const [cumulativeVerified, setCumulativeVerified] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem('ads_cumulative_verified') || '0', 10)
      return isNaN(v) ? 0 : v
    } catch (e) { return 0 }
  })

  const pendingCount = payments.filter((p) => p.status === "pending").length
  const approvedCount = payments.filter((p) => p.status === "approved").length
  // displayed verified count includes historical cumulative verified/submitted items
  const verifiedCount = (payments.filter((p) => p.status === "verified").length || 0) + (cumulativeVerified || 0)

  // Persist cumulativeVerified when it changes
  useEffect(() => {
    try { localStorage.setItem('ads_cumulative_verified', String(cumulativeVerified || 0)); } catch (e) {}
  }, [cumulativeVerified])

  // Sum all payments converted to baseCurrency (ZAR by default)
  const totalInBase = payments.reduce((sum, p) => {
    const converted = convertAmount(p.amount, p.currency || baseCurrency, baseCurrency);
    return sum + (typeof converted === 'number' ? converted : 0);
  }, 0);

  const formatCurrency = (value, currency) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(value || 0);

  // Compute totals per currency (no conversion) so we can display each currency separately.
  const totalsByCurrency = payments.reduce((acc, p) => {
    const cur = p.currency || baseCurrency;
    acc[cur] = (acc[cur] || 0) + (Number(p.amount) || 0);
    return acc;
  }, {});

  // List of currencies present in the payments. Fallback to baseCurrency when empty.
  const currencies = Object.keys(totalsByCurrency).length ? Object.keys(totalsByCurrency) : [baseCurrency];

  // Rotation state: which currency index is currently shown and whether rotation is paused.
  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
  const [isRotationPaused, setIsRotationPaused] = useState(false);

  // Reset rotation when payments change.
  useEffect(() => {
    setCurrentCurrencyIndex(0);
  }, [payments.length]);

  // Auto-rotate the displayed currency every 5 seconds when not paused.
  useEffect(() => {
    if (isRotationPaused) return;
    if (currencies.length <= 1) return;
    const id = setInterval(() => {
      setCurrentCurrencyIndex((i) => (i + 1) % currencies.length);
    }, 5000);
    return () => clearInterval(id);
  }, [currencies, isRotationPaused]);

  const currentCurrency = currencies[currentCurrencyIndex] || baseCurrency;
  const currentTotal = totalsByCurrency[currentCurrency] || 0;

  // Format amount without introducing extra floating point noise.
  const currencyFractionDigits = (cur) => ({ JPY: 0, KRW: 0, default: 2 }[cur] ?? 2);
  const formatByCurrency = (value, currency) => {
    const digits = currencyFractionDigits(currency);
    return new Intl.NumberFormat(currency === 'ZAR' ? 'en-ZA' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits, style: 'currency', currency }).format(Number(value) || 0);
  };

  const formatAmountRaw = (value, currency) => {
    const digits = currencyFractionDigits(currency);
    // show formatted number without altering user's entered precision beyond currency rules
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value) || 0);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-accent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-black dark:text-on-accent" />
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-on-accent">Employee Portal</h1>
                <p className="text-sm text-black dark:text-on-accent">International Payment Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-black dark:text-on-accent">EMP123456</p>
                <p className="text-xs text-black dark:text-on-accent">Payment Officer</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/")} className="text-black dark:text-on-accent">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{verifiedCount}</div>
              <p className="text-xs text-muted-foreground">Ready for SWIFT</p>
            </CardContent>
          </Card>

          <Card onClick={() => setIsRotationPaused((p) => !p)} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <span className="text-xs font-medium text-muted-foreground">{currentCurrency}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatByCurrency(currentTotal, currentCurrency)}</div>
              <p className="text-xs text-muted-foreground">
                Showing totals for <strong>{currentCurrency}</strong>. {isRotationPaused ? 'Paused — click to resume rotation' : 'Rotating currencies every 5s — click to pause'}
                {ratesError && (
                  <span className="block text-xs text-destructive mt-1">FX rates unavailable: {ratesError}</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SWIFT Submission</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSubmitToSwift}
                  disabled={isLoading || payments.length === 0 || approvedCount === 0}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Submit {approvedCount} to SWIFT
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
            <CardDescription>Review and verify international payment requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="search">Search Payments</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by customer, payment ID, or recipient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Filter by Status</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
            </div>

            {/* Payments List */}
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <Card key={payment.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-lg">{payment.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString()} at{" "}
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Name:</span>
                            <span className="ml-2">{payment.customerName}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Account:</span>
                            <span className="ml-2">{payment.accountNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Payment Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            
                            <span className="font-medium">Amount:</span>
                            <span className="ml-2 font-bold text-lg">
                              {formatAmountRaw(payment.amount, payment.currency)} {payment.currency}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Recipient:</span>
                            <span className="ml-2">{payment.recipientName}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">SWIFT Code:</span>
                            <span className="ml-2 font-mono">{payment.swiftCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Description:</span> {payment.description}
                      </p>
                    </div>

                    {payment.status === "pending" && (
                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={() => handleVerifyPayment(payment.id)}
                          disabled={isLoading}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" onClick={() => setSelectedPayment(payment)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Payment</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting payment {payment.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="reason">Rejection Reason</Label>
                                <Textarea
                                  id="reason"
                                  placeholder="Enter the reason for rejection..."
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleRejectPayment(payment.id, rejectionReason)}
                                  disabled={!rejectionReason.trim() || isLoading}
                                  variant="destructive"
                                >
                                  Confirm Rejection
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredPayments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No payments found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "No payment transactions available at this time"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Clear transactions button at bottom of Payment Transactions */}
            <div className="mt-4 flex justify-end">
              <Button variant="destructive" onClick={() => {
                if (!confirm('Are you sure you want to delete ALL transactions? This cannot be undone.')) return;
                try { localStorage.removeItem('ads_payments'); } catch (e) {}
                setPayments([]);
                setFilteredPayments([]);
              }}>
                Clear Transactions
              </Button>
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
