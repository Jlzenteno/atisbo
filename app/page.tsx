import React from 'react';
import { HeroSection } from '@/components/ui/HeroSection';
import { TravelStats } from '@/components/ui/TravelStats';
import { Newsletter } from '@/components/ui/Newsletter';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection 
        title="Todo Chile en Bicicleta"
        subtitle="Una travesía para recorrer cada comuna del país sobre dos ruedas. Descubriendo paisajes, historias y la esencia de nuestra tierra."
        ctaLabel="Explorar el viaje"
        ctaLink="/mapa"
      />
      
      <TravelStats />

      {/* Map Preview Placeholder */}
      <section className="py-24 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none">
                El Progreso del Mapa
              </h2>
              <p className="text-xl text-zinc-500 max-w-lg leading-relaxed">
                Visualiza el recorrido de Isabel por todo el territorio nacional. 
                Cada región coloreada y cada comuna marcada cuenta una historia diferente.
              </p>
              <div className="pt-4">
                <a href="/mapa" className="text-black font-bold uppercase tracking-widest text-sm border-b-2 border-black pb-1 hover:opacity-70 transition-opacity">
                  Ver mapa completo
                </a>
              </div>
            </div>
            
            <div className="flex-1 w-full bg-white rounded-[40px] aspect-[4/5] shadow-2xl border border-zinc-100 flex items-center justify-center p-12">
               {/* Simplified Chile SVG Placeholder */}
               <svg viewBox="0 0 100 800" className="h-full opacity-20">
                  <path d="M50 10 C 30 100, 70 200, 50 300 C 30 400, 70 500, 50 600 C 30 700, 70 800, 50 900" 
                    fill="none" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <span className="text-zinc-300 font-bold uppercase tracking-[0.3em] text-xs">Mapa Interactivo</span>
                 <span className="text-zinc-200 mt-2">[Próximamente]</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Journal Entries Placeholder */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-none">
              Últimas Bitácoras
            </h2>
            <a href="/blog" className="hidden md:block text-zinc-400 hover:text-black transition-colors font-medium">
              Ver todas →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cards will go here */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-[30px] bg-zinc-100 mb-6">
                   <div className="w-full h-full bg-zinc-200 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">Región de Los Lagos</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-400">Dic 2024</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight group-hover:underline">
                    Cruzando el corazón de la Araucanía: Entre volcanes y araucarias
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
