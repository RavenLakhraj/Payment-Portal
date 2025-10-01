import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import LoginEmployee from './pages/Employee/Login';
import LoginCustomer from './pages/Customer/LoginCustomer';
import Register from './pages/Customer/Register';
import MakePayment from './pages/customer/MakePayment';
import PaymentSuccess from './pages/customer/PaymentSuccess';
import PaymentsList from './pages/employee/PaymentsList';
import Dashboard from './pages/Employee/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-customer" element={<Register />} />
        <Route path="/login-customer" element={<LoginCustomer />} />
        <Route path="/login-employee" element={<LoginEmployee />} />
        <Route path="/customers/payment" element={<MakePayment />} />
        <Route path="/customers/payment-success" element={<PaymentSuccess />} />
        <Route path="/employees/payments" element={<PaymentsList />} />
        <Route path="/employees/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;