import React from 'react';
import Link from 'next/link';
import { Bike, Instagram, Youtube, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-full bg-white text-black">
                <Bike size={20} />
              </div>
              <span className="font-bold tracking-tighter text-2xl uppercase">Atisbo</span>
            </Link>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed">
              Un proyecto documental de viajes recorriendo cada rincón de Chile en bicicleta. 
              Siguiendo la ruta, conectando con la gente y descubriendo la historia de nuestro país.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Explorar</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/mapa" className="hover:text-white transition-colors">Mapa del Viaje</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Bitácoras</Link></li>
              <li><Link href="/galeria" className="hover:text-white transition-colors">Galería Visual</Link></li>
              <li><Link href="/proyecto" className="hover:text-white transition-colors">El Proyecto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Redes</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/_atisbo" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/@atisbo" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://facebook.com/isatisbo" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} ATISBO — Todo Chile en Bicicleta.</p>
          <p>Desarrollado con ❤️ por <a href="#" className="text-white hover:underline">Kutral Studio</a></p>
        </div>
      </div>
    </footer>
  );
}
