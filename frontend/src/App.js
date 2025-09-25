import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.js'
import LoginEmployee from './components/LoginEmployee.js'
import LoginCustomer from './components/LoginCustomer.js'
import Register from './components/Register.js'
import MakePayment from './components/MakePayment.js'
import PaymentSuccess from './components/PaymentSuccess.js'
import PaymentsList  from './components/PaymentsList.js'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path ='/register-customer' element={<Register/>}></Route>
        <Route path ='/login-customer' element={<LoginCustomer/>}></Route>
        <Route path ='/login-employee' element={<LoginEmployee/>}></Route>
        <Route path = '/customers/payment' element={<MakePayment/>}></Route>
        <Route path = '/customers/payment-success' element={<PaymentSuccess/>}></Route>
        <Route path = '/employees/payments' element={<PaymentsList/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
