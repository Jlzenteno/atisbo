'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Photo } from '@/types';
import { 
  Plus, 
  Trash2, 
  ImageIcon, 
  Link as LinkIcon,
  Loader2,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    caption: '',
    is_featured: false
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    setLoading(true);
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  }

  async function handleAddPhoto(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);

    const { data, error } = await supabase
      .from('photos')
      .insert([newPhoto])
      .select()
      .single();

    if (!error && data) {
      setPhotos([data, ...photos]);
      setNewPhoto({ url: '', caption: '', is_featured: false });
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    if (window.confirm('¿Eliminar esta fotografía de la galería?')) {
      const { error } = await supabase.from('photos').delete().eq('id', id);
      if (!error) {
        setPhotos(photos.filter(p => p.id !== id));
      }
    }
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
          <h1 className="text-5xl font-serif font-bold tracking-tighter">Galería</h1>
          <p className="text-zinc-500">Gestiona el archivo visual de tu travesía.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Add Photo Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8 sticky top-32">
            <h3 className="text-2xl font-serif font-bold tracking-tighter">Agregar Foto</h3>
            <form onSubmit={handleAddPhoto} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">URL de la Imagen</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                  <input 
                    type="url"
                    required
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 pl-12 pr-6 rounded-2xl outline-none transition-all text-xs text-zinc-500 font-mono"
                    placeholder="https://cloudinary.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Pie de Foto (Opcional)</label>
                <input 
                  type="text"
                  value={newPhoto.caption}
                  onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 px-6 rounded-2xl outline-none transition-all text-sm"
                  placeholder="Ej: Amanecer en las Torres del Paine"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
                 <span className="text-xs font-bold uppercase tracking-widest">Destacada</span>
                 <button 
                  type="button"
                  onClick={() => setNewPhoto({ ...newPhoto, is_featured: !newPhoto.is_featured })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                    newPhoto.is_featured ? "bg-black" : "bg-zinc-200"
                  )}
                 >
                   <motion.div 
                     animate={{ x: newPhoto.is_featured ? 24 : 4 }}
                     className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                   />
                 </button>
              </div>

              <button 
                type="submit"
                disabled={adding || !newPhoto.url}
                className="w-full bg-black text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
              >
                {adding ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 
                Añadir a Galería
              </button>
            </form>

            <div className="p-6 bg-zinc-50 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tip</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                Usa el dashboard de Cloudinary para subir tus fotos y pega aquí el "Link Directo" para mantener la máxima calidad.
              </p>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <AnimatePresence>
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white rounded-[40px] overflow-hidden shadow-sm border border-zinc-100 aspect-square"
                >
                  <img src={photo.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={photo.caption || ''} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-between">
                    <div className="flex justify-end gap-2">
                      <a href={photo.url} target="_blank" className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-black transition-all">
                        <ExternalLink size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(photo.id)}
                        className="p-3 bg-red-500/20 backdrop-blur-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {photo.caption && (
                      <p className="text-white font-medium text-sm leading-tight">{photo.caption}</p>
                    )}
                    {photo.is_featured && (
                      <span className="absolute bottom-8 right-8 bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Destacada</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
