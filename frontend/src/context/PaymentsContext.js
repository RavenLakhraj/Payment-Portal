import React, { createContext, useContext, useEffect, useState } from 'react';

const PaymentsContext = createContext(null);

export function PaymentsProvider({ children }) {
  const [payments, setPayments] = useState(() => {
    try {
      const raw = localStorage.getItem('ads_payments');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
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
