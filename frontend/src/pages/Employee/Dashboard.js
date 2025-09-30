import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Shield, LogOut, Search, CheckCircle, XCircle, Clock, DollarSign, Globe, User, AlertTriangle } from "lucide-react";

export default function EmployeeDashboard() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app this would come from API
  useEffect(() => {
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
      {
        id: "PAY002",
        customerName: "Alice Johnson",
        accountNumber: "2345678901",
        amount: 2500,
        currency: "EUR",
        recipientName: "Bob Wilson",
        recipientAccount: "8765432109",
        swiftCode: "DEUTDEFF500",
        status: "pending",
        createdAt: "2025-01-15T11:15:00Z",
        description: "Invoice payment",
      },
      {
        id: "PAY003",
        customerName: "Mike Brown",
        accountNumber: "3456789012",
        amount: 1200,
        currency: "GBP",
        recipientName: "Sarah Davis",
        recipientAccount: "7654321098",
        swiftCode: "BARCGB22XXX",
        status: "verified",
        createdAt: "2025-01-15T09:45:00Z",
        description: "Personal transfer",
      },
    ]
    setPayments(mockPayments)
    setFilteredPayments(mockPayments)
  }, [])

  // Filter payments based on search and status
  useEffect(() => {
    let filtered = payments

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [payments, searchTerm, statusFilter])

  const handleVerifyPayment = async (paymentId) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPayments((prev) =>
        prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "verified" } : payment))
      );
    } catch (error) {
      console.error("Failed to verify payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectPayment = async (paymentId, reason) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPayments((prev) =>
        prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "rejected" } : payment))
      );
      setRejectionReason("")
      setSelectedPayment(null)
    } catch (error) {
      console.error("Failed to reject payment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitToSwift = async () => {
    const verifiedPayments = payments.filter((p) => p.status === "verified")
    if (verifiedPayments.length === 0) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPayments((prev) =>
        prev.map((payment) => (payment.status === "verified" ? { ...payment, status: "submitted" } : payment))
      );
    } catch (error) {
      console.error("Failed to submit to SWIFT:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      pending: { variant: "secondary", icon: Clock, text: "Pending Review" },
      verified: { variant: "default", icon: CheckCircle, text: "Verified" },
      rejected: { variant: "destructive", icon: XCircle, text: "Rejected" },
      submitted: { variant: "outline", icon: Globe, text: "Submitted to SWIFT" },
    };
    const { variant, icon: Icon, text } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {text}
      </Badge>
    );
  };

  const pendingCount = payments.filter((p) => p.status === "pending").length
  const verifiedCount = payments.filter((p) => p.status === "verified").length
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Employee Portal</h1>
                <p className="text-sm text-muted-foreground">International Payment Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">EMP123456</p>
                <p className="text-xs text-muted-foreground">Payment Officer</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/")}>
                <LogOut className="h-4 w-4 mr-2" />
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All currencies combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SWIFT Submission</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSubmitToSwift}
                disabled={verifiedCount === 0 || isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Submit {verifiedCount} to SWIFT
              </Button>
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
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">Amount:</span>
                            <span className="ml-2 font-bold text-lg">
                              {payment.amount.toLocaleString()} {payment.currency}
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
                          Verify Payment
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
