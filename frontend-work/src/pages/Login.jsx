import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const justRegistered = location.state?.registered;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
console.log("YO")
    try {
      console.log("Hello")
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
console.log("response", response)
      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          access_token: data.access_token,
          id: data.user.id,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          email: data.user.email,
          role: data.user.role,
        })
      );

      if (data.user.role === "company") {
        navigate("/results");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      console.log("error", err)
      setError("Could not connect to server");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
    >
      {/* Left side — text */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-16">
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
          <p className="text-lg text-white/80">
            Log in to manage your ads, check offers, and connect with
            professionals.
          </p>
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-[480px] min-h-screen bg-gray-950/95 backdrop-blur-sm flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Log In
          </h2>

          {justRegistered && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg text-sm mb-5 text-center">
              Account created! Please log in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}