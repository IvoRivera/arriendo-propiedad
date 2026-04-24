"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      router.push("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError("Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-[#e2d9cc]/50 rounded-[32px] shadow-lg p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#6b7c4a]/10 rounded-full flex items-center justify-center text-[#6b7c4a] mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl text-[#2c2416] italic">Acceso Administrador</h1>
          <p className="text-[#6b5d4f] text-sm mt-2 text-center">Ingresa tus credenciales para gestionar solicitudes.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none font-sans"
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#9a8a78] ml-1">Contraseña</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#faf7f2]/50 border border-[#e2d9cc] rounded-xl px-4 py-3 text-[#2c2416] focus:ring-1 focus:ring-[#6b7c4a] focus:border-[#6b7c4a] transition-all outline-none font-sans"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#6b7c4a] text-white rounded-full font-sans text-xs font-semibold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:bg-[#5a6a3d] transition-all disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar al Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
