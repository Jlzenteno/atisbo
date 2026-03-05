'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-xl space-y-6 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-serif font-bold tracking-tighter"
            >
              Sigue el Viaje
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-zinc-400 leading-relaxed font-light"
            >
              Únete a la comunidad de ATISBO y recibe las últimas bitácoras, 
              fotografías y reflexiones directamente en tu correo. Sin spam, solo aventura.
            </motion.p>
          </div>

          <div className="w-full max-w-md">
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] text-center space-y-4"
              >
                <div className="flex justify-center">
                  <CheckCircle2 size={48} className="text-zinc-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">¡Bienvenida/o a bordo!</h3>
                <p className="text-zinc-500">Gracias por sumarte a esta travesía. Revisa tu correo pronto.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white h-20 px-8 rounded-full text-lg outline-none transition-all placeholder:text-zinc-600 group-hover:bg-zinc-900"
                  />
                  <button
                    disabled={status === 'loading'}
                    className="absolute right-3 top-3 bottom-3 px-8 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Enviando...' : <Send size={20} />}
                  </button>
                </div>
                <p className="text-[10px] text-center text-zinc-600 uppercase tracking-[0.2em]">
                  Respetamos tu privacidad. Desuscríbete cuando quieras.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
