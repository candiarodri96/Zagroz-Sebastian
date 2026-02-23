import Header from "../components/Header.jsx";
import SelectOption from "../components/SelectOption.jsx";
import React from "react";
import PainterGubbe from "../components/PainterGubbe.jsx";

function Home() {
  return (
    <>
      {/* HERO – full screen */}
      <div className="min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-2">
          <div className="grid grid-cols-2 gap-16 items-start">

            <div className="flex flex-col">
              <Header />

              <h2 className="mt-6 text-white text-2xl font-semibold">
                Matching help to your solutions
              </h2>

              <div className="-mt-12">
                <PainterGubbe width="250" height="250" />
              </div>
            </div>

            <div className="flex flex-col mt-20">
              <SelectOption />
            </div>

          </div>
        </div>
      </div>

      {/* ABOUT – starts AFTER full screen */}
      <div
        id="about"
        className="min-h-screen flex items-center text-white"
      >
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-6">
            About WorkFlow
          </h2>
          <p className="max-w-2xl text-lg">
            This platform connects tasks with solutions.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;