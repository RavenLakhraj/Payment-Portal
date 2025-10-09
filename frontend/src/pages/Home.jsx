import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      gap: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '30px' }}>Welcome to Payment Portal</h1>

      <div style={{display:'flex',gap:12}}>
        <Link to='/login-employee' style={{
          padding:'12px 24px',
          backgroundColor:'#007bff',
          color:'#fff',
          borderRadius:'6px',
          textDecoration:'none',
          fontWeight:'bold'
        }}>
          Continue as Employee
        </Link>

        <Link to='/login-customer' style={{
          padding:'12px 24px',
          backgroundColor:'#28a745',
          color:'#fff',
          borderRadius:'6px',
          textDecoration:'none',
          fontWeight:'bold'
        }}>
          Continue as Customer
        </Link>
      </div>
    </div>
  )
}
