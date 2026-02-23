import React from "react";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-end bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1482731215275-a1f151646268?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="absolute inset-0 bg-blue-500/20 z-0"></div>

      <div className="w-full max-w-6xl justify-between items-start flex flex-col md:flex-row p-10 z-10 px-8 relative gap-12">
        <div className="text-2xl mb-4">
          <h1>Lets find your next work</h1>
          <p>The best website for making your business your own</p>
          <p>
            Log in or register today to dive in and make take on an assignment
          </p>
        </div>

        <div>
            <RegisterForm></RegisterForm>
        </div>

      </div>
    </div>
  );
}
