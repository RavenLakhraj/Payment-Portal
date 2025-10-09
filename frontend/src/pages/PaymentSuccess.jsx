import React from 'react'
import { Link } from 'react-router-dom'

export default function PaymentSuccess(){
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:40}}>
      <h2>Payment submitted</h2>
      <p>Your payment was submitted successfully. You can view it in My Payments.</p>
      <Link to='/customers/payments' style={{color:'#0d6efd',textDecoration:'none'}}>View Payments</Link>
    </div>
  )
}
