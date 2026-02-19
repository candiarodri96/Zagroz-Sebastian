import React from 'react'
import { Link } from "react-router-dom"

export default function Loginform() {
  return (
<<<<<<< backend/candiarodri96
    <div>Loginform</div>
=======
    <div className="w-95 bg-gray-900 border p-8 ">
          <form className="space-y-5">
            <h2 className="text-2xl font-bold">Log In</h2>

            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-blue-500" />
              <label htmlFor="remember" className="text-sm">Remember Me</label>
            </div>

            <div>
              <Link to={"/register"} className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors" >
                Haven't registered yet? 
              </Link>
            </div>
            <div>
              <Link to={""} className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Forgot your password? 
              </Link>
            </div>

            <button className="w-full bg-black text-white py-2 rounded">
              Continue
            </button>
          </form>
        </div>
>>>>>>> main
  )
}