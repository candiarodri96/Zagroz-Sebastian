import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

export default function Loginform() {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[error, setError] = useState("");
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/profile");
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-95 bg-gray-900 border p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold">Log In</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="accent-blue-500" />
          <label htmlFor="remember" className="text-sm">Remember Me</label>
        </div>

        <div>
          <Link to="/register" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Haven't registered yet?
          </Link>
        </div>
        <div>
          <Link to="" className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Forgot your password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Logging in..." : "Continue"}
        </button>
      </form>
    </div>
  )
}