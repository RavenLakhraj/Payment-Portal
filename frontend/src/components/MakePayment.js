import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function MakePayment() {
    const [amount, setAmount] = useState('')
    const [currency, setCurrency] = useState('')
    const [provider, setProvider] = useState('')
    const [payeeName, setPayeeName] = useState('')
    const [payeeAccountNumber, setPayeeAccountNumber] = useState('')
    const [swiftCode, setSwiftCode] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('https://localhost:2000/payments/make-payment',
                {
                    amount,
                    currency,
                    provider,
                    payeeName,
                    payeeAccountNumber,
                    swiftCode
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setMessage('Payment sent.')
            console.log(response.data)

            navigate('/customers/payment-success')

        } catch (err) {
            if (err.response) {
                setMessage(err.response.data.message || 'Payment failed.')
            } else {
                setMessage('Network error.')
            }

            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            {/* Amount */}
            <input
                type="text"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount"
            />

            {/* Currency Dropdown */}
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="">Select currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="GBP">GBP - Great British Pound</option>
            </select>

            {/* Provider Radio Buttons */}
            <div>
                <p>Payment Provider:</p>
                <label>
                    <input
                        type="radio"
                        value="swift"
                        checked={provider === 'swift'}
                        onChange={e => setProvider(e.target.value)}
                    />
                    SWIFT
                </label>
            </div>

            {/* Payee Name */}
            <input
                type="text"
                value={payeeName}
                onChange={e => setPayeeName(e.target.value)}
                placeholder="Payee Name"
            />

            {/* Payee Account Number */}
            <input
                type="text"
                value={payeeAccountNumber}
                onChange={e => setPayeeAccountNumber(e.target.value)}
                placeholder="Payee Account Number"
            />

            {/* SWIFT Code */}
            <input
                type="text"
                value={swiftCode}
                onChange={e => setSwiftCode(e.target.value)}
                placeholder="SWIFT Code"
            />

            <button type="submit">Submit Payment</button>
            {message && <p>{message}</p>}

        </form>

    )
}