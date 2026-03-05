'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bike, Map as MapIcon, Camera, Heart } from 'lucide-react';

export default function ProjectPage() {
  const sections = [
    {
      title: 'El Origen',
      icon: <Heart className="text-zinc-400" />,
      content: 'ATISBO nació de una curiosidad profunda por Chile y un deseo de conectar con el territorio a una velocidad humana. Pedalear permite ver lo que los autos ignoran y sentir el relieve de nuestra geografía en cada músculo.'
    },
    {
      title: 'El Desafío',
      icon: <Bike className="text-zinc-400" />,
      content: 'El objetivo es ambicioso: recorrer las 346 comunas de Chile. No se trata solo de llegar, sino de estar. Visitar cada plaza central, conversar con sus habitantes y documentar la identidad de cada rincón.'
    },
    {
      title: 'Documentación',
      icon: <Camera className="text-zinc-400" />,
      content: 'A través de bitácoras, fotografía y video, Isabel captura la esencia de este viaje de largo aliento. Este sitio es el archivo vivo de esa travesía, un documental interactivo que evoluciona con cada pedalada.'
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-32">
          <div className="flex-1 space-y-8">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400"
            >
              Sobre ATISBO
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-serif font-bold tracking-tighter leading-none"
            >
              Todo Chile en Bicicleta
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-zinc-500 font-light leading-relaxed"
            >
              Una travesía física, visual y emocional para mapear la esencia de nuestro país desde la libertad que solo dos ruedas pueden entregar.
            </motion.p>
          </div>
          <div className="flex-1 w-full aspect-square bg-zinc-100 rounded-[60px] overflow-hidden shadow-2xl skew-y-3">
             <img 
               src="https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1000" 
               className="w-full h-full object-cover -skew-y-3 scale-110"
               alt="Isabel en bicicleta"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-6"
            >
              <div className="p-4 bg-zinc-50 rounded-2xl w-fit">
                {section.icon}
              </div>
              <h3 className="text-3xl font-serif font-bold tracking-tighter">{section.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
