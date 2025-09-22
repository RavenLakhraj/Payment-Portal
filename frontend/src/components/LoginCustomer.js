import { useState } from 'react'
import { useNavigate  } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function LoginCustomer() {
  const [email, setEmail] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('https://localhost:2000/customers/login', 
        { email, accountNumber, password })

      const data = response.data

      if (response.status === 200) {
        setMessage(data.message)
        localStorage.setItem('token', data.token)
        const role = data.role

        navigate('/customers/payment')

      } else {
        setMessage(data.message)
      }
    } catch (err) {
      console.error(err)
      setMessage('Network error')
    }
  }

  return (
    <div>
      <h1>Customer Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <div> 
        <Link to="/register">Don't have an account? Register now</Link>
      </div>
    </div>

  )
}
