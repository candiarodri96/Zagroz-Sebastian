import React from 'react'

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

            <div>
              <button className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Haven't registered yet? 
              </button>
            </div>
            <div>
              <button className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Forgot your password? 
              </button>
            </div>

            <button className="w-full bg-black text-white py-2 rounded">
              Continue
            </button>
          </form>
        </div>
>>>>>>> main
  )
}
