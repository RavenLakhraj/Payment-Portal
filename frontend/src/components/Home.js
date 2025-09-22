import { Link } from 'react-router-dom'

export default function Home() { 
    return (
    <div>
      <h1>Home Page</h1>
      <Link to='/employees/login'>Continue as Employee</Link>
      <br />
      <Link to='/customers/login'>Continue as Customer</Link>
    </div>
    )
}