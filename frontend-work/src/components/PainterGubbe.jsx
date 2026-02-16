// src/components/PainterGubbe.jsx
import React from 'react';

const PainterGubbe = ({ 
  width = "100px",   // Standardbredd
  height = "auto",   // Höjden anpassas automatiskt
  className = "" 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', overflow: 'visible' }}
      role="img"
      aria-label="En liten vit hantverkargubbe med hammare och skiftnyckel"
    >
      {/* --- Kropp och Huvud --- */}
      {/* En fluffig vit form. Vi använder en ljusgrå kantlinje för definition mot vita bakgrunder */}
      <g fill="#ffffff" stroke="#e0e0e0" strokeWidth="1">
          {/* Fötter */}
          <ellipse cx="40" cy="90" rx="8" ry="5" />
          <ellipse cx="60" cy="90" rx="8" ry="5" />
          {/* Huvudkropp */}
          <path d="M50,5 C30,5 15,25 15,55 C15,85 30,92 50,92 C70,92 85,85 85,55 C85,25 70,5 50,5 Z" />
      </g>

      {/* --- Ögon --- */}
      <g fill="#333333">
          <circle cx="40" cy="35" r="7" />
          <circle cx="60" cy="35" r="7" />
          {/* Blänk i ögonen */}
          <circle cx="42" cy="33" r="2" fill="white" />
          <circle cx="62" cy="33" r="2" fill="white" />
      </g>
      
      {/* --- Verktyg --- */}
      {/* Hammare i vänster hand (sett från gubben) */}
      <g transform="translate(15, 55) rotate(-20)">
          {/* Handtag */}
          <rect x="0" y="-2" width="30" height="6" rx="2" fill="#8B4513" stroke="#5a2d0c" strokeWidth="0.5" />
          {/* Huvud */}
          <path d="M-5,-8 L5,-8 L7,0 L9,-8 L12,-8 L12,8 L-5,8 Z" fill="#A9A9A9" stroke="#696969" strokeWidth="0.5" />
      </g>
       {/* En liten vit "hand" som håller hammaren */}
       <circle cx="25" cy="60" r="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1"/>


      {/* Skiftnyckel i höger hand */}
      <g transform="translate(85, 55) rotate(20) scale(-1, 1)">
         {/* Handtag/Kropp */}
         <rect x="0" y="-3" width="25" height="6" rx="2" fill="#A9A9A9" stroke="#696969" strokeWidth="0.5" />
         {/* Käft */}
         <path d="M-2,-6 C-6,-6 -8,-2 -8,2 C-8,6 -6,10 -2,10 L2,6 L2,-2 Z" fill="#A9A9A9" stroke="#696969" strokeWidth="0.5"/>
      </g>
      {/* En liten vit "hand" som håller skiftnyckeln */}
      <circle cx="75" cy="60" r="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1"/>

    </svg>
  );
};

export default PainterGubbe;