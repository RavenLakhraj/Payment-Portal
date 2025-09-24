import { Link } from 'react-router-dom'

export default function Home() { 
    return (
    <div>
      <h1>Home Page</h1>
      <Link to='/login-employee'>Continue as Employee</Link>
      <br />
      <Link to='/login-customer'>Continue as Customer</Link>
    </div>
    )
}