// Home.jsx
import Header from "../components/Header.jsx";
import Searchbar from "../components/Searchbar.jsx";
import SelectOption from "../components/SelectOption.jsx";
import React from "react";
// Importen är korrekt här:
import PainterGubbe from "../components/PainterGubbe.jsx";

function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-2">

      <div className="grid grid-cols-2 gap-16 items-start">

        {/* VÄNSTER KOLUMN */}
        <div className="flex flex-col mt-50">
          <Header />

          <h2 className="mt-6 ml-10 text-white text-2xl font-semibold"> {/* Lade till lite text-styling */}
            Matching help to your solutions
          </h2>

          {/* --- HÄR LÄGGER VI IN GUBBEN (Baserat på principen i Exempel 1) --- */}
          {/* Vi lägger den i en div för att kunna använda Tailwind-klasser 
             för positionering (marginaler).
             ml-10: För att linjera med texten ovanför.
             mt-8: Lite luft mellan texten och gubben.
          */}
          <div className="mt-8 ml-10">
             {/* Eftersom bakgrunden antas vara mörk, syns den vita gubben bra. */}
             <PainterGubbe width="180px" />
          </div>
          {/* ------------------------------------------------------------------ */}

        </div>

        {/* HÖGER KOLUMN */}
        <div className="flex flex-col justify-center mt-50">
          <SelectOption />
          
        </div>

      </div>

    </div>
  );
}

export default Home;