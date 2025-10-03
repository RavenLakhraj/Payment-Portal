import { Link, useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }
    return (
        <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#28a745', marginBottom: '30px' }}>Payment Successful!</h1>

            <div style={{ marginBottom: '20px' }}>
                <Link
                    to="/customers/payment"
                    style={{
                        textDecoration: 'none',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '5px',
                        display: 'inline-block'
                    }}
                >
                    Make Another Payment
                </Link>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
        </div>
    )

}