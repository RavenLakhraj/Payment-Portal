import { Link, useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    return (
        <div>
            <h1>Payment successful</h1>
            <div>
                <Link to="/customers/payment">Make another payment</Link>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}