import { useEffect, useState } from 'react'
import axios from 'axios'

export default function PaymentsList() {
    const [payments, setPayments] = useState([])
    const [error, setError] = useState('')
    const [statusFilter, setStatusFilter] = useState('Pending')

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchPayments()
    }, [statusFilter])

    const fetchPayments = async () => {
        try {
            let url = 'https://localhost:2000/payments'
            if (statusFilter) {
                url += `?status=${statusFilter}`
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setPayments(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payments.')
        }
    }

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(
                `https://localhost:2000/payments/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchPayments()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.')
        }
    }

    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div>
            <h2>Payments</h2>

            {/* Dropdown filter */}
            <label>
                Filter by status:{' '}
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="Pending">Pending verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Submitted">Submitted to SWIFT</option>
                    <option value="Rejected">Rejected</option>
                    <option value="">All</option>
                </select>
            </label>

            {payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
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
                            <th>Actions</th>
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
                                <td>
                                    {payment.status === 'Pending' && (
                                        <button onClick={() => updateStatus(payment._id, 'Verified')}>
                                            Verify
                                        </button>
                                    )}
                                    {payment.status === 'Verified' && (
                                        <button onClick={() => updateStatus(payment._id, 'Submitted')}>
                                            Submit to SWIFT
                                        </button>
                                    )}
                                </td>
                                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}