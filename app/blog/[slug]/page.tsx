'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          regions (name),
          comunas (name)
        `)
        .eq('slug', params.slug)
        .eq('published', true)
        .single();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="animate-spin text-zinc-300" size={48} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 space-y-6">
        <h1 className="text-4xl font-serif font-bold tracking-tighter">Relato no encontrado</h1>
        <Link href="/blog" className="text-black font-bold uppercase tracking-widest text-[10px] border-b border-black pb-1">
          Volver a Bitácoras
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen pb-24">
      {/* Header / Hero */}
      <div className="relative h-[70vh] w-full flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src={post.cover_image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16 text-white w-full">
           <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors group">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Volver a Bitácoras</span>
           </Link>
           
           <div className="flex gap-4 items-center mb-6">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">
                {post.regions?.name}
              </span>
           </div>
           
           <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tighter leading-none mb-8">
             {post.title}
           </h1>
           
           <div className="flex flex-wrap gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm font-medium">{post.travel_date ? new Date(post.travel_date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-sm font-medium">{post.comunas?.name}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-20">
        <div 
          className="prose prose-zinc lg:prose-xl prose-headings:font-serif prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-zinc-600 prose-img:rounded-[30px] prose-img:shadow-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
