'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Photo } from '@/types';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (data) setPhotos(data);
      setLoading(false);
    }

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-zinc-300 font-serif text-2xl italic tracking-tighter">Preparando galería...</div>
      </div>
    );
  }
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400"
          >
            Galería Visual
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tighter"
          >
            Fragmentos de Chile
          </motion.h1>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative group cursor-pointer overflow-hidden rounded-[30px] break-inside-avoid shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={photo.url} 
                alt={photo.caption || `Travel photo ${index + 1}`}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <span className="text-white text-xs uppercase tracking-[0.2em] font-bold">
                  {photo.caption || 'Ver Fotografía'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
