import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentsList() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending');

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        fetchPayments();
    }, [statusFilter]);

    const fetchPayments = async () => {
        try {
            let url = 'https://localhost:2000/payments';
            if (statusFilter) {
                url += `?status=${statusFilter}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPayments(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payments.');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(
                `https://localhost:2000/payments/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPayments();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        }
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Payments</h2>

            {/* Dropdown filter */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
                    Filter by status:
                </label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="Pending">Pending verification</option>
                    <option value="Verified">Verified</option>
                    <option value="Submitted">Submitted to SWIFT</option>
                    <option value="Rejected">Rejected</option>
                    <option value="">All</option>
                </select>
            </div>

            {payments.length === 0 ? (
                <p style={{ color: '#666' }}>No payments found.</p>
            ) : (
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginBottom: '20px',
                    }}
                >
                    <thead style={{ backgroundColor: '#f2f2f2' }}>
                        <tr>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Customer ID</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Amount</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Currency</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Provider</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Payee Name</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Payee Account</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>SWIFT Code</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Status</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
                            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id}>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.customerId}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.amount}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.currency}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.provider}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.payeeName}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.payeeAccountNumber}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.swiftCode}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{payment.status}</td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                                    {payment.status === 'Pending' && (
                                        <button
                                            onClick={() => updateStatus(payment._id, 'Verified')}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                backgroundColor: '#28a745',
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Verify
                                        </button>
                                    )}
                                    {payment.status === 'Verified' && (
                                        <button
                                            onClick={() => updateStatus(payment._id, 'Submitted')}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                backgroundColor: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Submit to SWIFT
                                        </button>
                                    )}
                                </td>
                                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                                    {new Date(payment.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                onClick={handleLogout}
                style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Logout
            </button>
        </div>
    );
}