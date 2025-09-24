import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('https://localhost:2000/customers/register',
        {
          fullName,
          idNumber,
          accountNumber,
          email,
          password
        })

      setMessage('Registration successful')
      console.log(response.data)
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || 'Registration failed.')
      } else {
        setMessage('Network error.')
      }

      console.error(err)
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => {
            const value = e.target.value
            if (value === '' || /^[A-Za-z\s-]+$/.test(value)) {
              setFullName(value)
            }
          }}
          required
        />
        <br />

        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => {
            const value = e.target.value
            if (value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              setEmail(value)
            }
          }}
          required
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            const value = e.target.value
            if (value === '' || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/.test(value)) {
              setPassword(value)
            }
          }}
          required
        />
        <br />

        <input
          type="text"
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => {
            const value = e.target.value
            if (value === '' || /^\d{13}$/.test(value)) {
              setIdNumber(value)
            }
          }}
          required
        />
        <br />

        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => {
            const value = e.target.value
            if (value === '' || /^\d{9,12}$/.test(value)) {
              setAccountNumber(value)
            }
          }}
          required
        />
        <br />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
      <div>
        <Link to="/login-customer">Already have an account? Log in now</Link>
      </div>
    </div>
  )
}