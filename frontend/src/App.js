import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' element={<Home/>}></Route>
        <Route path = '/login' element={<Login/>}></Route>
        <Route path = '/register' element={<Register/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;
