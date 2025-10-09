// src/App.js

import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Assuming these page components exist in './pages'
import Home from './pages/Home'
import LoginCustomer from './pages/LoginCustomer'
import LoginEmployee from './pages/LoginEmployee'
import Register from './pages/Register'
import MakePayment from './pages/MakePayment'
import PaymentsListPage from './pages/PaymentsList'
import PaymentSuccess from './pages/PaymentSuccess'
import CustomerPortal from './pages/CustomerPortal'
import EmployeePortal from './pages/EmployeePortal'

export default function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login-customer' element={<LoginCustomer />} />
        <Route path='/login-employee' element={<LoginEmployee />} />
        <Route path='/register-customer' element={<Register />} />

        <Route path='/customers/payment' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MakePayment />
          </ProtectedRoute>
        } />

        <Route path='/customers/payments' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PaymentsListPage forRole='customer' />
          </ProtectedRoute>
        } />

        <Route path='/customers/payment-success' element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PaymentSuccess />
          </ProtectedRoute>
        } />

        <Route path='/employees/payments' element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeePortal />
          </ProtectedRoute>
        } />
        
        {/* The Link component here was causing the error without BrowserRouter */}
        <Route path='*' element={<div style={{padding:20}}>Page not found <Link to='/'>Back</Link></div>} />
      </Routes>
    </div>
  )
}