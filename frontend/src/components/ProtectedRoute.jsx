import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../api'

export default function ProtectedRoute({ children, allowedRoles=[] }){
  const [ok, setOk] = useState(null)

  useEffect(()=>{
    let mounted = true
    api.get('/auth/ping')
      .then(res => {
        if(!mounted) return
        const role = res.data?.role
        if(!allowedRoles || allowedRoles.length === 0) setOk(true)
        else setOk(allowedRoles.includes(role))
      })
      .catch(()=> { if(mounted) setOk(false) })

    return ()=> { mounted = false }
  },[allowedRoles])

  if(ok === null) return <div style={{padding:20}}>Checking session...</div>
  if(ok === false) return <Navigate to='/' />
  return children
}
