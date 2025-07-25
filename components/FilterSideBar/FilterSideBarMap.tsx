// components/SideMiniMap.tsx

"use client";
import React from "react";

// Affiche une mini carte dans la sidebar, avec une image de mockup
export default function SideMiniMap() {
  return (
    <div className="mb-6 border-2 border-blue-500 rounded-lg p-2 bg-white flex flex-col items-center">
      <span className="px-2 text-blue-700 font-semibold text-sm mb-2">
        Carte de la zone
      </span>
      <img
        src="/sidBarMap.png"
        alt="Mini carte de la zone"
        className="rounded w-full h-32 object-cover"
        style={{ maxWidth: 240 }}
      />
    </div>
  );
}
