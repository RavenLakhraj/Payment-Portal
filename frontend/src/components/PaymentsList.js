import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PaymentsList() {

    console.log('PaymentsList component rendered')

    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPendingPayments = async () => {
            try {
                console.log('Fetching pending payments...')

                const token = localStorage.getItem('token')
                const response = await axios.get(
                    'https://localhost:2000/payments/pending',
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                setPayments(response.data)
                setLoading(false)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch payments.')
                setLoading(false)
            }
        }

        fetchPendingPayments()
    }, [])

    if (loading) return <p>Loading pending payments...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    if (payments.length === 0) return <p>No pending payments found.</p>

    return (
        <div>
            <h2>Pending Payments</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Provider</th>
                        <th>Payee Name</th>
                        <th>Payee Account</th>
                        <th>SWIFT Code</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(payment => (
                        <tr key={payment._id}>
                            <td>{payment.customerId}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.currency}</td>
                            <td>{payment.provider}</td>
                            <td>{payment.payeeName}</td>
                            <td>{payment.payeeAccountNumber}</td>
                            <td>{payment.swiftCode}</td>
                            <td>{payment.status}</td>
                            <td>{new Date(payment.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}