import React from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function Navbar(){
  const handleLogout = async () => {
    try{ await api.post('/auth/logout') } catch(e) { /* ignore */ }
    // Force full reload to clear client state
    window.location.href = '/'
  }

  return (
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 20px',background:'#0d6efd',color:'#fff'}}>
      <div style={{fontWeight:700}}>
        <Link to='/' style={{color:'#fff',textDecoration:'none'}}>Payment Portal</Link>
      </div>

      <nav style={{display:'flex',gap:16,alignItems:'center'}}>
        <Link to='/' style={{color:'#fff', textDecoration:'none'}}>Home</Link>
        <Link to='/login-customer' style={{color:'#fff', textDecoration:'none'}}>Customer Login</Link>
        <Link to='/login-employee' style={{color:'#fff', textDecoration:'none'}}>Employee Login</Link>
        <button onClick={handleLogout} style={{background:'#dc3545',border:'none',padding:'8px 12px',borderRadius:6,color:'#fff',cursor:'pointer'}}>Logout</button>
      </nav>
    </header>
  )
}
