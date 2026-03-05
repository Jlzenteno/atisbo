'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  FileText, 
  Image as ImageIcon, 
  Users, 
  TrendingUp,
  Plus,
  ArrowRight,
  Bike
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    photos: 0,
    subscribers: 0,
    comunasVisited: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: posts },
        { count: photos },
        { count: subscribers },
        { count: comunas }
      ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('photos').select('*', { count: 'exact', head: true }),
        supabase.from('subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('comunas').select('*', { count: 'exact', head: true }).eq('visited', true),
      ]);

      setStats({
        posts: posts || 0,
        photos: photos || 0,
        subscribers: subscribers || 0,
        comunasVisited: comunas || 0
      });
    }

    fetchStats();
  }, []);

  const cards = [
    { label: 'Bitácoras', value: stats.posts, icon: <FileText className="text-blue-500" />, href: '/admin/posts' },
    { label: 'Fotografías', value: stats.photos, icon: <ImageIcon className="text-purple-500" />, href: '/admin/gallery' },
    { label: 'Suscriptores', value: stats.subscribers, icon: <Users className="text-orange-500" />, href: '/admin/subscribers' },
    { label: 'Comunas', value: stats.comunasVisited, icon: <TrendingUp className="text-green-500" />, href: '/admin/map' },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-bold tracking-tighter">Hola, Atisbo</h1>
          <p className="text-zinc-500">Aquí tienes un resumen de tu travesía digital.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/admin/posts/new" 
            className="bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl"
          >
            <Plus size={16} /> Nueva Bitácora
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-zinc-50 rounded-2xl group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <span className="text-4xl font-bold tracking-tighter">{card.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">{card.label}</span>
              <Link href={card.href} className="text-zinc-300 hover:text-black transition-colors">
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity Placeholder */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
          <h3 className="text-2xl font-serif font-bold tracking-tighter">Actividad Reciente</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Nueva bitácora publicada en Los Lagos</p>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest mt-1">Hace 2 días</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-zinc-900 p-10 rounded-[40px] shadow-2xl text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Bike size={120} />
          </div>
          <h3 className="text-2xl font-serif font-bold tracking-tighter relative z-10">Consejos de Ruta</h3>
          <div className="space-y-6 relative z-10">
            <p className="text-zinc-400 leading-relaxed font-light">
              Recuerda subir las fotos en alta calidad. Cloudinary se encargará de optimizarlas para que el sitio se mantenga rápido.
            </p>
            <div className="pt-4">
              <Link href="/admin/help" className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-1 hover:border-white transition-all">
                Guía de Usuario →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
