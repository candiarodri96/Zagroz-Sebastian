import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Building2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select whether you are a customer or a company.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Registration failed");
        setLoading(false);
        return;
      }

      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError("Could not connect to server");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: "url('/images/register-bg.jpg')" }}
    >
      {/* Left side — text */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-16">
        <div className="text-white max-w-md">
          <h1 className="text-5xl font-bold mb-6">Join Us</h1>
          <p className="text-lg text-white/80">
            Whether you need work done or provide services — create your account
            and get started today.
          </p>
        </div>
      </div>

      {/* Right side — form */}
      <div className="w-full lg:w-[480px] min-h-screen bg-gray-950/95 backdrop-blur-sm flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => selectRole("customer")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.role === "customer"
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <User size={28} />
                  <span className="font-medium text-sm">Customer</span>
                  <span className="text-xs text-center">I need work done</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectRole("company")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.role === "company"
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <Building2 size={28} />
                  <span className="font-medium text-sm">Company</span>
                  <span className="text-xs text-center">I provide services</span>
                </button>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

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
                minLength={8}
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
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
