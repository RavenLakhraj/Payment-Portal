import React, { useEffect, useState } from 'react'
import api from '../api'
import PaymentsList from '../components/PaymentsList'

export default function EmployeePortal(){
  const [counters, setCounters] = useState({})
  const [verifiedCount, setVerifiedCount] = useState(0)

  useEffect(()=>{
    api.get('/employees/counters').then(r => setCounters(r.data || {})).catch(()=>{})
    api.get('/employees/verified-count').then(r => setVerifiedCount(r.data.count || 0)).catch(()=>{})
  },[])

  const sendToSwift = () => {
    api.post('/employees/submit-swift').then(r => setVerifiedCount(vc => vc + (r.data.sent || 0))).catch(()=> alert('Could not submit to SWIFT'))
  }

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{display:'flex',gap:12}}>
          {['USD','EUR','ZAR','GBP'].map(code => (
            <div key={code} style={{padding:10,background:'#fff',border:'1px solid #eee',borderRadius:6,minWidth:110}}>
              <div style={{fontSize:12,color:'#666'}}>{code}</div>
              <div style={{fontWeight:700}}>{counters[code] ?? 0}</div>
            </div>
          ))}
        </div>

        <div>
          <button onClick={sendToSwift} style={{padding:'8px 14px',background:'#0d6efd',color:'#fff',borderRadius:6,border:'none'}}>Send verified to SWIFT</button>
          <div style={{marginTop:6,fontSize:12}}>Verified counter: {verifiedCount}</div>
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:6,padding:12}}>
        <PaymentsList forRole='employee' />
      </div>
    </div>
  )
}
