import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    //Regex patterns for frontend validation
    const nameRegex = /^[A-Za-z\s-]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/
    const idRegex = /^\d{13}$/
    const accountRegex = /^\d{9,12}$/

    if (!nameRegex.test(fullName)) {
      setMessage('Names may only contain letters and hyphens.')
      return
    }

    if (!emailRegex.test(email)) {
      setMessage('Invalid email format.')
      return
    }

    if (!passwordRegex.test(password)) {
      setMessage('Password must be a minimum of 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.')
      return
    }

    if (!idRegex.test(idNumber)) {
      setMessage('Invalid ID number.')
      return
    }

    if (!accountRegex.test(accountNumber)) {
      setMessage('Valid account numbers are between 9 and 12 digits long.')
      return
    }

    try {
      const response = await axios.post('https://localhost:2000/customers/register',
        {
          fullName,
          idNumber,
          accountNumber,
          email,
          password
        })

      navigate('/login-customer')
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
      <div>
        <Link to="/login-customer">Already have an account? Log in now</Link>
      </div>
    </div>
  )
}