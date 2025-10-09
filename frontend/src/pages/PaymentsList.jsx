import React from 'react'
import PaymentsListComponent from '../components/PaymentsList'

export default function PaymentsListPage({ forRole='customer' }){
  return <PaymentsListComponent forRole={forRole} />
}
