import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

function sanitize(value){
  if(typeof value !== 'string') return value
  return value.replace(/[<>"'();]/g, '').trim()
}

export default function LoginCustomer(){
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try{
      const response = await api.post('/customers/login', {
        email: sanitize(email),
        accountNumber: sanitize(accountNumber),
        password: sanitize(password)
      })

      if(response.status === 200){
        navigate('/customers/payment')
      } else {
        setMessage(response.data.message || 'Login failed')
      }
    }catch(err){
      setMessage(err.response?.data?.message || 'Network error. Please try again.')
      console.error(err)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Customer Login</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ccc',fontSize:'16px'}}/>
        <input type="text" placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ccc',fontSize:'16px'}}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{padding:'10px',borderRadius:'6px',border:'1px solid #ccc',fontSize:'16px'}}/>
        <button type="submit" style={{padding:'12px',borderRadius:'6px',border:'none',backgroundColor:'#007bff',color:'#fff',fontWeight:'bold',cursor:'pointer',fontSize:'16px'}}>Login</button>
      </form>

      {message && <p style={{ marginTop: '15px', color: 'red' }}>{message}</p>}

      <div style={{ marginTop: '20px' }}>
        <Link to="/register-customer" style={{ color: '#007bff', textDecoration: 'none' }}>
          Don't have an account? Register now
        </Link>
      </div>

      <div style={{ marginTop: '10px' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
