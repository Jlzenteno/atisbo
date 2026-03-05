'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface StatProps {
  label: string;
  value: string | number;
  delay?: number;
}

function Stat({ label, value, delay = 0 }: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center p-8 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-black transition-colors"
    >
      <span className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">{value}</span>
      <span className="text-xs uppercase tracking-[0.3em] font-medium text-zinc-400">{label}</span>
    </motion.div>
  );
}

export function TravelStats() {
  const [counts, setCounts] = useState({ comunas: 0, regions: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [{ count: comunasCount }, { count: regionsCount }] = await Promise.all([
        supabase.from('comunas').select('*', { count: 'exact', head: true }).eq('visited', true),
        supabase.from('regions').select('*', { count: 'exact', head: true }).eq('visited', true),
      ]);

      setCounts({
        comunas: comunasCount || 0,
        regions: regionsCount || 0
      });
    }

    fetchStats();
  }, []);

  const stats = [
    { label: 'Comunas Recorridas', value: `${counts.comunas} / 346`, delay: 0.1 },
    { label: 'Regiones Visitadas', value: `${counts.regions} / 16`, delay: 0.2 },
    { label: 'Kilómetros en Ruta', value: '12,400', delay: 0.3 },
    { label: 'Días de Viaje', value: '520', delay: 0.4 },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Stat key={index} {...stat} />
        ))}
      </div>
    </section>
  );
}
