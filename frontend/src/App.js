import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js';
import Payment from './components/Payment.js';
import Transactions from './components/Transactions.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path = '/login' element={<Login/>}></Route>
        <Route path = '/register' element={<Register/>}></Route>
        <Route path = '/payment' element={<Payment/>}></Route>
        <Route path = '/transactions' element={<Transactions/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;
