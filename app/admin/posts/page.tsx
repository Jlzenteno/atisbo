'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  Calendar,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta bitácora?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) {
        setPosts(posts.filter(p => p.id !== id));
      }
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-bold tracking-tighter">Bitácoras</h1>
          <p className="text-zinc-500">Gestiona tus relatos y experiencias de viaje.</p>
        </div>
        <Link 
          href="/admin/posts/new" 
          className="bg-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl"
        >
          <Plus size={16} /> Nueva Bitácora
        </Link>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-zinc-100 overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-12 pl-12 pr-6 rounded-xl outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 px-4 py-2 rounded-lg">
              Total: {filteredPosts.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-50">Portada</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-50">Título</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-50 text-center">Estado</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-zinc-400 border-b border-zinc-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-zinc-400 italic">Cargando bitácoras...</td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-zinc-400 italic">No se encontraron bitácoras.</td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="p-6 border-b border-zinc-50">
                      <div className="w-20 h-14 rounded-xl bg-zinc-100 overflow-hidden shadow-sm">
                        {post.cover_image && (
                          <img src={post.cover_image} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-6 border-b border-zinc-50">
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-900 group-hover:text-black">{post.title}</p>
                        <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('es-CL')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 border-b border-zinc-50 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        post.published 
                          ? "bg-green-50 text-green-600 border border-green-100" 
                          : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                      )}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="p-6 border-b border-zinc-50 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          target="_blank"
                          className="p-3 text-zinc-400 hover:text-black hover:bg-white rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          href={`/admin/posts/${post.id}`} 
                          className="p-3 text-zinc-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-3 text-zinc-400 hover:text-red-600 hover:bg-white rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
