import React from 'react'

export default function RegisterForm() {
  return (
    <div className="w-95 bg-gray-900 border p-8 ">
          <form className="space-y-5">
            <h2 className="text-2xl font-bold">Register</h2>

            <div>
              <label className="block mb-1 text-sm">First Name</label>
              <input
                type=""
                className="w-full border p-2 rounded"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Last Name</label>
              <input
                type=""
                className="w-full border p-2 rounded"
                placeholder="Doe"
              />
            </div>

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
                Already a member? Log in
              </button>
            </div>

            <button className="w-full bg-black text-white py-2 rounded">
              Continue
            </button>
          </form>
        </div>
  )
}
