'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Map as MapIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
          alt="Ruta perdida"
          className="w-full h-full object-cover opacity-40 blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-white/40 mb-4 block">
            Error 404
          </span>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-none mb-6">
            Te has salido del camino
          </h1>
          <p className="text-xl text-zinc-400 font-light leading-relaxed mb-12">
            La ruta que buscas no existe o ha cambiado de dirección. 
            No te preocupes, en este viaje no hay pérdidas, solo nuevos descubrimientos.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link 
            href="/"
            className="group inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </Link>
          <Link 
            href="/mapa"
            className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all"
          >
            <MapIcon size={16} />
            Ver el Mapa
          </Link>
        </motion.div>
      </div>

      {/* Decorative bike silhouette or simple icon */}
      <motion.div 
        animate={{ 
          x: [0, 10, 0],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 right-10 text-white/5 pointer-events-none"
      >
        <span className="text-[200px] font-serif font-bold italic select-none">Atisbo</span>
      </motion.div>
    </div>
  );
}
