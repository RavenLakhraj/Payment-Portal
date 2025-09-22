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
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <br />

        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <input
          type="text"
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />
        <br />

        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
        <br />

        <button type="submit">Register</button>
      </form>

      <p>{message}</p>
    </div>
  )
}