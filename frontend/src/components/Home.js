import { Link } from 'react-router-dom'

export default function Home() { 
    return (
    <div>
      <h1>Home Page</h1>
      <Link to="/register">Register here</Link>
      <Link to="/login">Login here</Link>
    </div>
    )
}