import React from 'react';

const PainterGubbeSpots = ({
  width = "100%",
  height = "auto",
  className = ""
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 500"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
      role="img"
      aria-label="En vit äggformad figur med blåa färgfläckar på kroppen håller i en pensel med blå färg."
    >
      <defs>
        {/* Klarare blå gradient för penseln */}
        <linearGradient id="bluePaintGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Ljusare klarblå */}
          <stop offset="100%" stopColor="#1d4ed8" /> {/* Mörkare klarblå */}
        </linearGradient>
        
        {/* Radial gradient för att ge gubben en 3D-känsla */}
        <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="85%" stopColor="#e6e6e6"/>
            <stop offset="100%" stopColor="#d0d0d0"/>
        </radialGradient>
      </defs>

      {/* --- GOLV SEKTION --- */}
      <g transform="translate(0, 400)">
        
        {/* --- Gubben --- */}
        {/* Flyttad lite mer till mitten nu när burken är borta */}
        <g transform="translate(300, -30)">
            {/* Kropp med 3D-gradient */}
            <path d="M0,-130 C-60,-130 -105,-60 -105,20 C-105,90 -60,110 0,110 C60,110 105,90 105,20 C105,-60 60,-130 0,-130 Z" fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1.5"/>
            
            {/* --- NYTT: Blåa fläckar på kroppen --- */}
            {/* Använder en fast färg som matchar den ljusa delen av gradienten */}
            <g fill="#3b82f6" opacity="0.9">
                <circle cx="-25" cy="-30" r="7" />
                <ellipse cx="35" cy="40" rx="9" ry="6" transform="rotate(-15 35 40)" />
                <circle cx="15" cy="-80" r="5" />
                <ellipse cx="-40" cy="60" rx="6" ry="8" transform="rotate(30 -40 60)" />
                <circle cx="60" cy="0" r="4" />
                <circle cx="-10" cy="90" r="5" opacity="0.8" />
            </g>

            {/* Fötter */}
            <ellipse cx="-30" cy="105" rx="22" ry="12" fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1.5"/>
            <ellipse cx="30" cy="105" rx="22" ry="12" fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1.5"/>

            {/* Ögon */}
            <g fill="#202020">
                <circle cx="-32" cy="-55" r="15" />
                <circle cx="32" cy="-55" r="15" />
                <circle cx="-25" cy="-62" r="5" fill="white" />
                <circle cx="39" cy="-62" r="5" fill="white" />
            </g>
            
            {/* Vänster hand (liten bula) */}
             <ellipse cx="-95" cy="10" rx="15" ry="18" fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1.5"/>

            {/* Höger hand som håller penseln */}
            <g transform="translate(85, 20) rotate(-20)">
                {/* Pensel */}
                <rect x="-10" y="-10" width="20" height="60" fill="#8B4513" rx="4" stroke="#5a2d0c" strokeWidth="1"/>
                <rect x="-12" y="-35" width="24" height="25" fill="#A9A9A9" stroke="#7f7f7f" strokeWidth="1"/>
                {/* Borst med färg */}
                <path d="M-15,-35 L15,-35 L20,-80 C10,-95 -10,-95 -20,-80 Z" fill="url(#bluePaintGrad)" />
            </g>
             {/* Handen ovanpå penseln */}
            <circle cx="85" cy="35" r="18" fill="url(#bodyGrad)" stroke="#d0d0d0" strokeWidth="1.5"/>
        </g>

        {/* Färgburken är borttagen härifrån */}
      </g>
    </svg>
  );
};

export default PainterGubbeSpots;