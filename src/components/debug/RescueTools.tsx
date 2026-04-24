"use client";

import React from "react";

export const RescueTools: React.FC = () => {
  return (
    <button
      onPointerDown={() => {
        console.log("RESCUE POINTER DOWN");
        alert('RESCUE POINTER DOWN - Interacción Verificada');
      }}
      className="fixed bottom-0 left-0 w-full h-14 bg-red-600 text-white z-[2147483647] font-bold text-lg active:bg-red-900 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center"
      style={{ pointerEvents: 'auto', touchAction: 'none' }}
    >
      BOTÓN DE EMERGENCIA (TAP AQUÍ)
    </button>
  );
};
