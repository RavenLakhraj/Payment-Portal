import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function LoginCustomer() {
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:2000/customers/login", {
        email,
        accountNumber,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        setMessage(data.message);
        localStorage.setItem("token", data.token);
        navigate("/customers/payment");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Login failed. Please try again.");
      } else if (err.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("Unexpected error. Please try again later.");
      }
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Login</h1>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          className="py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      {/* Message */}
      {message && <p className="mt-4 text-red-600">{message}</p>}

      {/* Links */}
      <div className="mt-6 space-y-2 text-center">
        <Link to="/register-customer" className="text-blue-600 hover:underline block">
          Don’t have an account? Register now
        </Link>

        <Link to="/" className="text-gray-600 hover:underline flex items-center justify-center gap-1">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
