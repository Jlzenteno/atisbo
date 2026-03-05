'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Region, Comuna } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  ChevronRight,
  ChevronDown,
  MapPin,
  Bike,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export default function AdminMapPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [comunas, setComunas] = useState<Record<string, Comuna[]>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  async function fetchRegions() {
    setLoading(true);
    const { data } = await supabase.from('regions').select('*').order('name');
    if (data) setRegions(data);
    setLoading(false);
  }

  async function toggleRegion(regionId: string) {
    if (expandedRegion === regionId) {
      setExpandedRegion(null);
      return;
    }

    setExpandedRegion(regionId);
    if (!comunas[regionId]) {
      const { data } = await supabase
        .from('comunas')
        .select('*')
        .eq('region_id', regionId)
        .order('name');
      if (data) {
        setComunas(prev => ({ ...prev, [regionId]: data }));
      }
    }
  }

  async function handleToggleVisited(type: 'region' | 'comuna', id: string, currentStatus: boolean) {
    setUpdating(id);
    const table = type === 'region' ? 'regions' : 'comunas';
    
    const { error } = await supabase
      .from(table)
      .update({ visited: !currentStatus })
      .eq('id', id);

    if (!error) {
      if (type === 'region') {
        setRegions(regions.map(r => r.id === id ? { ...r, visited: !currentStatus } : r));
      } else {
        // Find which region this comuna belongs to and update local state
        for (const rId in comunas) {
          if (comunas[rId].some(c => c.id === id)) {
            setComunas(prev => ({
              ...prev,
              [rId]: prev[rId].map(c => c.id === id ? { ...c, visited: !currentStatus } : c)
            }));
            break;
          }
        }
      }
    }
    setUpdating(null);
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-zinc-300" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-bold tracking-tighter">Mapa & Progreso</h1>
          <p className="text-zinc-500">Marca las regiones y comunas que has conquistado.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {regions.map((region) => (
          <div 
            key={region.id}
            className="bg-white rounded-[32px] shadow-sm border border-zinc-100 overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between group">
              <button 
                onClick={() => toggleRegion(region.id)}
                className="flex items-center gap-6 flex-1 text-left"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                  region.visited ? "bg-black text-white" : "bg-zinc-50 text-zinc-300"
                )}>
                  {region.visited ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{region.name}</h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">
                    {comunas[region.id]?.filter(c => c.visited).length || 0} / {comunas[region.id]?.length || '—'} Comunas
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleToggleVisited('region', region.id, region.visited)}
                  disabled={updating === region.id}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                    region.visited 
                      ? "bg-zinc-900 border-zinc-900 text-white" 
                      : "bg-white border-zinc-100 text-zinc-400 hover:border-black hover:text-black"
                  )}
                >
                  {updating === region.id ? '...' : region.visited ? 'Visitada' : 'Marcar Visitada'}
                </button>
                <button 
                  onClick={() => toggleRegion(region.id)}
                  className="p-2 text-zinc-300 group-hover:text-black transition-colors"
                >
                  {expandedRegion === region.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedRegion === region.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-zinc-50/50 border-t border-zinc-50"
                >
                  <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {!comunas[region.id] ? (
                      <div className="col-span-full py-10 text-center text-zinc-400 italic flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin" /> Cargando comunas...
                      </div>
                    ) : (
                      comunas[region.id].map((comuna) => (
                        <button
                          key={comuna.id}
                          onClick={() => handleToggleVisited('comuna', comuna.id, comuna.visited)}
                          disabled={updating === comuna.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl transition-all border",
                            comuna.visited 
                              ? "bg-white border-black/5 shadow-sm text-black" 
                              : "bg-transparent border-transparent text-zinc-400 hover:bg-white hover:border-zinc-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center",
                              comuna.visited ? "bg-black text-white" : "bg-zinc-100 text-zinc-300"
                            )}>
                              {comuna.visited ? <CheckCircle2 size={14} /> : <MapPin size={14} />}
                            </div>
                            <span className="text-sm font-medium">{comuna.name}</span>
                          </div>
                          {updating === comuna.id && <Loader2 size={12} className="animate-spin" />}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
