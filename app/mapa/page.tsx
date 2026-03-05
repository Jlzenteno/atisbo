'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, ChevronRight, Bike } from 'lucide-react';
import { cn } from '@/utils/cn';
import { supabase } from '@/lib/supabase';

interface RegionData {
  id: string;
  name: string;
  slug: string;
  visited: boolean;
  comunas_count?: number;
}

export default function MapaPage() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [totalComunas, setTotalComunas] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // Fetch regions and count of visited comunas
      const { data: regionsData } = await supabase
        .from('regions')
        .select(`
          id, 
          name, 
          slug, 
          visited
        `)
        .order('name');

      // Fetch total visited comunas for the counter
      const { count } = await supabase
        .from('comunas')
        .select('*', { count: 'exact', head: true })
        .eq('visited', true);

      setTotalComunas(count || 0);
      setRegions(regionsData || []);
    }

    fetchData();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 min-h-[70vh]">
          {/* Legend and Info */}
          <div className="lg:w-1/3 space-y-12">
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400"
              >
                Progreso Visual
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none">
                Mapa de Chile
              </h1>
              <p className="text-xl text-zinc-500 font-light leading-relaxed">
                Explora el avance del viaje por todo el territorio nacional. 
                Selecciona una región para ver el detalle de las comunas recorridas.
              </p>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
                    <Bike size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">{totalComunas} / 346</h4>
                    <p className="text-xs text-zinc-400">Comunas Completadas</p>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300">Regiones Recorridas</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {regions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(region)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl transition-all border",
                          selectedRegion?.id === region.id 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-black border-zinc-100 hover:border-black"
                        )}
                      >
                        <span className="font-medium">{region.name}</span>
                        <ChevronRight size={16} className={cn(selectedRegion?.id === region.id ? "opacity-100" : "opacity-20")} />
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Map Visualization Placeholder */}
          <div className="flex-1 bg-white rounded-[60px] shadow-2xl border border-zinc-100 relative overflow-hidden flex items-center justify-center p-12">
             <div className="absolute top-12 left-12">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-300">Visualización SVG</span>
             </div>
             
             {/* Realistic Chile Outline SVG container */}
             <svg viewBox="0 0 200 1000" className="h-[80%] drop-shadow-2xl">
                {/* Simplified regions as paths */}
                <motion.path 
                  d="M100 50 L 120 150 L 90 250 L 110 350 L 80 450 L 120 550 L 70 650 L 130 750 L 60 850 L 140 950"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="40" 
                  strokeLinecap="round"
                  className="text-zinc-100"
                />
                
                {regions.filter(r => r.visited).map((r, i) => (
                  <motion.circle 
                    key={r.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    cx={100 + (Math.random() * 20 - 10)} 
                    cy={100 + (i * 150)} 
                    r="15" 
                    className="fill-zinc-800"
                  />
                ))}
             </svg>

             {/* Region Tooltip overlay */}
             <AnimatePresence>
               {selectedRegion && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="absolute bottom-12 right-12 left-12 md:left-auto md:w-80 bg-black text-white p-8 rounded-[40px] shadow-2xl border border-white/10"
                 >
                    <div className="space-y-4">
                       <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Detalle Región</span>
                       <h3 className="text-3xl font-serif font-bold tracking-tighter">{selectedRegion.name}</h3>
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                             <p className="text-sm text-white/60">Estado de Región</p>
                             <p className="font-bold text-xl">{selectedRegion.visited ? 'Explorada' : 'Pendiente'}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs text-white/40 mb-1">Total país: {totalComunas}</p>
                             <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: selectedRegion.visited ? '100%' : '0%' }}
                                  className="h-full bg-white" 
                                />
                             </div>
                          </div>
                       </div>
                       <div className="pt-4">
                          <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <Info size={14} /> Ver bitácoras de esta región
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
