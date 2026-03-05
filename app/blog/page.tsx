'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image,
          travel_date,
          regions (name)
        `)
        .eq('published', true)
        .order('travel_date', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-pulse text-zinc-300 font-serif text-2xl italic tracking-tighter">Cargando relatos...</div>
      </div>
    );
  }
  return (
    <div className="pt-32 pb-24 min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400"
          >
            Bitácoras de Viaje
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tighter"
          >
            Historias desde el Camino
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-[40px] mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={post.cover_image || ''} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-black border border-black/10 px-3 py-1 rounded-full">
                      {post.regions?.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-zinc-400">
                      {post.travel_date ? new Date(post.travel_date).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }) : ''}
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold tracking-tight leading-tight group-hover:text-zinc-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
