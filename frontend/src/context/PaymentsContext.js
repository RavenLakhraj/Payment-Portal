import React, { createContext, useContext, useEffect, useState } from 'react';

const PaymentsContext = createContext(null);

const samplePayments = [
  {
    id: 'PAY001',
    customerName: 'John Smith',
    accountNumber: '1234567890',
    amount: 5000,
    currency: 'USD',
    recipientName: 'Jane Doe',
    recipientAccount: '9876543210',
    swiftCode: 'ABCDUS33XXX',
    status: 'pending',
    createdAt: '2025-01-15T10:30:00Z',
    description: 'Business payment for services',
  },
  {
    id: 'PAY002',
    customerName: 'Alice Johnson',
    accountNumber: '2345678901',
    amount: 2500,
    currency: 'EUR',
    recipientName: 'Bob Wilson',
    recipientAccount: '8765432109',
    swiftCode: 'DEUTDEFF500',
    status: 'pending',
    createdAt: '2025-01-15T11:15:00Z',
    description: 'Invoice payment',
  },
];

export function PaymentsProvider({ children }) {
  const [payments, setPayments] = useState(() => {
    try {
      const raw = localStorage.getItem('ads_payments');
      return raw ? JSON.parse(raw) : samplePayments;
    } catch (e) {
      return samplePayments;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ads_payments', JSON.stringify(payments));
    } catch (e) {}
  }, [payments]);

  const addPayment = (payment) => {
    setPayments((prev) => [payment, ...prev]);
  };

  const verifyPayment = (id) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'verified' } : p)));
  };

  const rejectPayment = (id, reason) => {
    // reason can be stored or logged; for demo we only set status
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p)));
  };

  const submitVerifiedToSwift = () => {
    setPayments((prev) => prev.map((p) => (p.status === 'verified' ? { ...p, status: 'submitted' } : p)));
  };

  const value = {
    payments,
    setPayments,
    addPayment,
    verifyPayment,
    rejectPayment,
    submitVerifiedToSwift,
  };

  return <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>;
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error('usePayments must be used within PaymentsProvider');
  return ctx;
}
