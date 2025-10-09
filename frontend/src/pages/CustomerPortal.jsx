import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function CustomerPortal(){
  const [counters, setCounters] = useState({})

  useEffect(()=>{
    api.get('/customers/counters')
      .then(r => setCounters(r.data || {}))
      .catch(() => {})
  },[])

  return (
    <div style={{padding:20}}>
      <h2>Customer Portal</h2>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:18}}>
        {['USD','EUR','ZAR','GBP'].map(code => (
          <div key={code} style={{padding:12,background:'#fff',border:'1px solid #eee',borderRadius:6,minWidth:120}}>
            <div style={{fontSize:12,color:'#666'}}>{code}</div>
            <div style={{fontWeight:700,fontSize:20}}>{counters[code] ?? 0}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:12}}>
        <Link to='/customers/payment' style={{padding:10,background:'#0d6efd',color:'#fff',borderRadius:6,textDecoration:'none'}}>Make a Payment</Link>
        <Link to='/customers/payments' style={{padding:10,background:'#6c757d',color:'#fff',borderRadius:6,textDecoration:'none'}}>My Payments</Link>
      </div>

      <div style={{marginTop:24}}>
        <h3>Recent transaction (example)</h3>
        <div style={{padding:12,background:'#fff',border:'1px solid #eee',borderRadius:6}}>
          <div>To: Example Payee</div>
          <div>Amount: 100.00 USD</div>
          <div>Status: Pending</div>
          <div style={{marginTop:8}}>
            <button style={{marginRight:8}}>Cancel</button>
            <Link to='/customers/payment' style={{textDecoration:'none'}}><button>Resubmit</button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
