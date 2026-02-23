import React from "react";
import Loginform from "../components/Loginform";

export default function Login() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-end bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1482731215275-a1f151646268?q=80&w=2070&auto=format&fit=crop')`,
      }}
    >
      <div className="absolute inset-0 bg-blue-500/20 z-0"></div>

      <div className="w-full max-w-6xl flex justify-between items-start p-10 z-10 px-8 relative gap-12">

        <div className="text-white max-w-lg">
          <h1 className="text-4xl font-bold">
            Lets find your next work
          </h1>

          <h2 className="text-3xl mt-4">
            The best website for making your business your own
          </h2>

          <p className="mt-4">
            Log in or register today to dive in and take on an assignment
          </p>
        </div>

        {/* ENDAST denna */}
        <Loginform />

      </div>
    </div>
  );
}