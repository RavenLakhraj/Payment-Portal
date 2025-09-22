import { Link } from 'react-router-dom'

export default function Register() { 
    return (
        <div>
            <h1>Register Page</h1>
            <Link to="/login">Already have an account? Log in now</Link>
        </div>
    ) 
}