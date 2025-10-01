// ...existing code...
import '../../../App.css';  // contains @tailwind directives
import React, { useState } from "react";
import { PaymentForm } from "../../components/ui/payment-form";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import Alert, { AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function payment() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedPayment, setSubmittedPayment] = useState(null);

  const handlePaymentSubmit = (paymentData) => {
    setSubmittedPayment(paymentData);
    setShowSuccess(true);
    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setSubmittedPayment(null);
    }, 5000);
  };

  if (showSuccess && submittedPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="container mx-auto max-w-2xl pt-8">
          <Card className="border-success">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-success">Payment Submitted Successfully</CardTitle>
              <CardDescription>Your international payment has been submitted for review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    Payment ID: <span className="font-mono">{submittedPayment.id}</span>
                  </div>
                  <div>
                    Amount: {" "}
                    <span className="font-medium">
                      {submittedPayment.amount} {submittedPayment.currency}
                    </span>
                  </div>
                  <div>
                    Recipient: <span className="font-medium">{submittedPayment.recipientName}</span>
                  </div>
                  <div>
                    Status: <span className="text-warning font-medium">Pending Review</span>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  Your payment will be reviewed by our international payments team within 1-2 business hours. You will
                  receive an email notification once the payment has been processed.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" component={Link} to="/customer/dashboard">
                  Return to Dashboard
                </Button>
                <Button variant="outline" component={Link} to="/customer/payment">
                  Make Another Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <header style={{ backgroundColor: '#9ABD97' }} className="border-b border-border mb-6">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-black">AdAstra Bank</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-black">New International Payment</p>
            <p className="text-xs text-black">Enter the payment details for international transfer</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl pt-2">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4" component={Link} to="/customer/dashboard">
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </span>
          </Button>
        </div>
        <PaymentForm onSubmit={handlePaymentSubmit} />
      </div>
    </div>
  );
}
