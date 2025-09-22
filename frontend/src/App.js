import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.js'
import LoginEmployee from './components/LoginEmployee.js'
import LoginCustomer from './components/LoginCustomer.js';
import Register from './components/Register.js';
import Payment from './components/Payment.js';
import Transactions from './components/Transactions.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path ='/customers/register' element={<Register/>}></Route>
        <Route path ='/customers/login' element={<LoginCustomer/>}></Route>
        <Route path ='/employees/login' element={<LoginEmployee/>}></Route>
        <Route path = '/payment' element={<Payment/>}></Route>
        <Route path = '/transactions' element={<Transactions/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;
