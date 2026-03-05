'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Bike } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem('atisbo_admin_session');
    if (isAdmin === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcoded credentials as requested
    if (username === 'Atisbo' && password === 'Cicloviaje.01') {
      localStorage.setItem('atisbo_admin_session', 'true');
      router.push('/admin');
    } else {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex p-4 bg-black text-white rounded-3xl mb-4">
            <Bike size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tighter">Panel de Control</h1>
          <p className="text-zinc-500">Ingresa tus credenciales para gestionar ATISBO</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-zinc-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 pl-12 pr-6 rounded-2xl outline-none transition-all"
                  placeholder="Atisbo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 pl-12 pr-6 rounded-2xl outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm px-4"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-zinc-400 text-xs">
          ATISBO — Todo Chile en Bicicleta
        </p>
      </motion.div>
    </div>
  );
}
