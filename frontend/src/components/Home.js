import { Link } from "react-router-dom";
import './App.css';  // contains @tailwind directives


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        Welcome to <span className="text-blue-600">Payment Portal</span>
      </h1>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to="/login-employee"
          className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Continue as Employee
        </Link>

        <Link
          to="/login-customer"
          className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Continue as Customer
        </Link>
      </div>
    </div>
  );
}
