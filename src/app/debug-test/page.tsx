"use client";

import { useState } from "react";

export default function DebugPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 gap-8 p-10">
      <h1 className="text-2xl font-bold text-black">TEST DE INTERACCIÓN</h1>
      <p className="text-black">Si puedes ver esto y el botón de abajo cambia el número, entonces el sistema base funciona.</p>
      
      <button 
        onClick={() => {
          console.log("Debug Button Clicked");
          setCount(c => c + 1);
        }}
        className="bg-blue-600 text-white px-10 py-5 rounded-full text-xl font-bold shadow-xl active:bg-blue-800 touch-manipulation"
      >
        PRESIONAR AQUÍ: {count}
      </button>

      <div className="mt-10 p-5 bg-white rounded-xl shadow-inner text-black">
        Prueba también haciendo scroll.
      </div>
    </div>
  );
}
