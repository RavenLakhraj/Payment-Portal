/**
 * This file contains the TransactionsPage component which displays a comprehensive
 * transaction history view for customers, including filtering, searching, and detailed
 * transaction information.
 */

import '../../../../App.css';  // contains @tailwind directives
import React, { useState } from "react";
// UI Components
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
// Icons
import { ArrowLeft, Search, Filter, Download, Eye } from "lucide-react";
// Routing and Context
import { Link } from "react-router-dom";
import { usePayments } from "../../../context/PaymentsContext";

/**
 * TransactionsPage Component
 * Displays a list of customer transactions with filtering and search capabilities.
 * Includes a modal for detailed transaction information.
 */
export default function TransactionsPage() {
  // State management for search, filtering, and modal
  const [searchTerm, setSearchTerm] = useState("") // Controls the search input
  const [statusFilter, setStatusFilter] = useState("all") // Controls the status filter dropdown
  const [selectedPayment, setSelectedPayment] = useState<any>(null) // Controls the detail modal

  // Get payments data from context
  const { payments } = usePayments();

  /**
   * Filter payments based on search term and status
   * - Filters by recipient name or payment ID
   * - Filters by payment status
   * - Case-insensitive search
   */
  const filteredPayments = (payments || []).filter((payment) => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      String(payment.recipientName || '').toLowerCase().includes(q) ||
      String(payment.id || '').toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  /**
   * Determines the number of decimal places for a given currency
   * Special handling for JPY and KRW which don't use decimal places
   */
  const currencyFractionDigits = (cur) => ({ JPY: 0, KRW: 0, default: 2 }[cur] ?? 2);

  /**
   * Formats a monetary amount with the appropriate number of decimal places
   * based on the currency type
   * @param {number} value - The amount to format
   * @param {string} currency - The currency code (e.g., USD, JPY, KRW)
   */
  const formatAmount = (value, currency) => {
    const digits = currencyFractionDigits(currency);
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value) || 0);
  }

  /**
   * Maps payment status to UI color variants
   * Used for status badges throughout the interface
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"    // Orange/yellow for pending
      case "verified":
        return "success"    // Green for verified
      case "submitted":
        return "default"    // Gray for submitted
      case "rejected":
        return "destructive" // Red for rejected
      default:
        return "secondary"  // Fallback color
    }
  }

  /**
   * Formats dates in UK format with time
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    // Main container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-6xl pt-8">
        {/* Page Header Section */}
        <div className="mb-6">
          {/* Back navigation button */}
          <Button variant="ghost" className="mb-4" component={Link} to="/customer/dashboard">
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </span>
          </Button>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground mt-2">View and manage your international payment transactions</p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
            <CardDescription>Track the status of your international payments</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search Input with icon */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by recipient or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Status Filter Dropdown */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {/* Export Button */}
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Transactions Table Section */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No transactions found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.recipientName}</div>
                            <div className="text-sm text-muted-foreground">{payment.recipientAccount}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatAmount(payment.amount, payment.currency)} {payment.currency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(payment.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Modal - Displays when a payment is selected */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            {/* Modal Card - Scrollable container for payment details */}
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Payment ID: {selectedPayment.id}</CardDescription>
              </CardHeader>
              {/* Modal Content */}
              <CardContent className="space-y-4">
                {/* Two-column grid for payment and recipient information */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column - Payment Details */}
                  <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="space-y-2 text-sm">
                      {/* Amount with currency */}
                      <div>
                        Amount:{" "}
                        <span className="font-medium">
                          {formatAmount(selectedPayment.amount, selectedPayment.currency)} {selectedPayment.currency}
                        </span>
                      </div>
                      {/* Payment provider */}
                      <div>
                        Provider: <span className="font-medium">{selectedPayment.provider}</span>
                      </div>
                      {/* Status badge with dynamic color */}
                      <div>
                        Status:{" "}
                        <Badge variant={getStatusColor(selectedPayment.status)}>{selectedPayment.status}</Badge>
                      </div>
                      {/* Creation date in UK format */}
                      <div>
                        Created: <span className="font-medium">{formatDate(selectedPayment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Right Column - Recipient Details */}
                  <div>
                    <h4 className="font-semibold mb-2">Recipient Details</h4>
                    <div className="space-y-2 text-sm">
                      {/* Recipient name */}
                      <div>
                        Name: <span className="font-medium">{selectedPayment.recipientName}</span>
                      </div>
                      {/* Account number in monospace font */}
                      <div>
                        Account: <span className="font-mono text-xs">{selectedPayment.recipientAccount}</span>
                      </div>
                      {/* SWIFT/BIC code in monospace font */}
                      <div>
                        SWIFT Code: <span className="font-mono">{selectedPayment.swiftCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Description Section */}
                {selectedPayment.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
                  </div>
                )}

                {/* Modal Footer - Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

//Comments are assisted and expanded on by GitHub Copilot