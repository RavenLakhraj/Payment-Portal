import React, { useEffect, useState } from 'react'
import api from '../api'

export default function PaymentsList({ forRole='customer' }){
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    const endpoint = forRole === 'employee' ? '/payments' : '/customers/payments'
    api.get(endpoint)
      .then(r => setPayments(r.data || []))
      .catch(() => setError('Could not load payments.'))
      .finally(()=> setLoading(false))
  },[forRole])

  if(loading) return <div style={{padding:20}}>Loading payments…</div>
  if(error) return <div style={{padding:20,color:'red'}}>{error}</div>

  return (
    <div style={{padding:20}}>
      <h2 style={{marginBottom:12}}>{forRole === 'employee' ? 'All Payments' : 'My Payments'}</h2>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left',padding:8,borderBottom:'1px solid #ddd'}}>Date</th>
            <th style={{textAlign:'left',padding:8,borderBottom:'1px solid #ddd'}}>Amount</th>
            <th style={{textAlign:'left',padding:8,borderBottom:'1px solid #ddd'}}>Currency</th>
            <th style={{textAlign:'left',padding:8,borderBottom:'1px solid #ddd'}}>Provider</th>
            <th style={{textAlign:'left',padding:8,borderBottom:'1px solid #ddd'}}>Status</th>
            {forRole === 'employee' && <th style={{padding:8,borderBottom:'1px solid #ddd'}}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} style={{borderBottom:'1px solid #f0f0f0'}}>
              <td style={{padding:8}}>{new Date(p.createdAt).toLocaleString()}</td>
              <td style={{padding:8}}>{p.amount}</td>
              <td style={{padding:8}}>{p.currency}</td>
              <td style={{padding:8}}>{p.provider}</td>
              <td style={{padding:8}}>{p.status}</td>
              {forRole === 'employee' && <td style={{padding:8}}>
                <button onClick={() => updateStatus(p.id,'approved')} style={{marginRight:8}}>Approve</button>
                <button onClick={() => updateStatus(p.id,'denied')} style={{background:'#dc3545',color:'#fff'}}>Deny</button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  function updateStatus(id,status){
    api.post(`/payments/${encodeURIComponent(id)}/status`, { status })
      .then(() => setPayments(ps => ps.map(p => p.id === id ? {...p, status} : p)))
      .catch(() => alert('Could not update status'))
  }
}
