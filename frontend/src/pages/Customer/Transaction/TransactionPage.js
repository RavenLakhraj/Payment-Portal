import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { ArrowLeft, Search, Filter, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { mockPayments } from "../../../components/ui/mock-data";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  // Filter payments based on search and status
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "verified":
        return "success"
      case "submitted":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="container mx-auto max-w-6xl pt-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" component={Link} to="/customer/dashboard">
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </span>
          </Button>
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground mt-2">View and manage your international payment transactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
            <CardDescription>Track the status of your international payments</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by recipient or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Transactions Table */}
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
                            {payment.amount.toLocaleString()} {payment.currency}
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

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Payment ID: {selectedPayment.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        Amount:{" "}
                        <span className="font-medium">
                          {selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                        </span>
                      </div>
                      <div>
                        Provider: <span className="font-medium">{selectedPayment.provider}</span>
                      </div>
                      <div>
                        Status:{" "}
                        <Badge variant={getStatusColor(selectedPayment.status)}>{selectedPayment.status}</Badge>
                      </div>
                      <div>
                        Created: <span className="font-medium">{formatDate(selectedPayment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Recipient Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        Name: <span className="font-medium">{selectedPayment.recipientName}</span>
                      </div>
                      <div>
                        Account: <span className="font-mono text-xs">{selectedPayment.recipientAccount}</span>
                      </div>
                      <div>
                        SWIFT Code: <span className="font-mono">{selectedPayment.swiftCode}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPayment.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
                  </div>
                )}

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
