'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Post, Region, Comuna } from '@/types';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export default function PostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    region_id: '',
    comuna_id: '',
    published: false,
    travel_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);
    
    // Fetch regions for the dropdown
    const { data: regionsData } = await supabase.from('regions').select('*').order('name');
    if (regionsData) setRegions(regionsData);

    if (!isNew) {
      const { data: postData, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (postData) {
        setFormData(postData);
        if (postData.region_id) fetchComunas(postData.region_id);
      }
    }

    setLoading(false);
  }

  async function fetchComunas(regionId: string) {
    const { data: comunasData } = await supabase
      .from('comunas')
      .select('*')
      .eq('region_id', regionId)
      .order('name');
    if (comunasData) setComunas(comunasData);
  }

  const handleRegionChange = (regionId: string) => {
    setFormData({ ...formData, region_id: regionId, comuna_id: '' });
    if (regionId) fetchComunas(regionId);
    else setComunas([]);
  };

  const generateSlug = () => {
    const slug = formData.title?.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({ ...formData, slug });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const dataToSave = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    let error;
    if (isNew) {
      const { error: insertError } = await supabase.from('posts').insert([dataToSave]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase.from('posts').update(dataToSave).eq('id', id);
      error = updateError;
    }

    if (!error) {
      router.push('/admin/posts');
    } else {
      alert('Error al guardar: ' + error.message);
      setSaving(false);
    }
  };

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
        <div className="space-y-4">
          <Link href="/admin/posts" className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors">
            <ArrowLeft size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Volver</span>
          </Link>
          <h1 className="text-5xl font-serif font-bold tracking-tighter">
            {isNew ? 'Nueva Bitácora' : 'Editar Bitácora'}
          </h1>
        </div>
        <div className="flex gap-4">
          {!isNew && (
            <Link 
              href={`/blog/${formData.slug}`} 
              target="_blank"
              className="bg-white text-black border border-zinc-100 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-zinc-50 transition-all shadow-sm"
            >
              <Eye size={16} /> Previsualizar
            </Link>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            {isNew ? 'Publicar Ahora' : 'Guardar Cambios'}
          </button>
        </div>
      </header>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Título del Relato</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={generateSlug}
                className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-16 px-8 rounded-2xl outline-none transition-all text-xl font-bold"
                placeholder="Ej: Entre volcanes y araucarias"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Resumen / Excerpt</label>
              <textarea 
                rows={3}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-100 focus:border-black p-8 rounded-[30px] outline-none transition-all resize-none"
                placeholder="Una breve descripción que aparecerá en los listados..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Contenido (HTML permitido)</label>
              <textarea 
                rows={15}
                required
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-100 focus:border-black p-8 rounded-[30px] outline-none transition-all font-mono text-sm leading-relaxed"
                placeholder="Cuerpo de la bitácora. Puedes usar etiquetas <p>, <h3>, etc."
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
            <h3 className="text-xl font-serif font-bold tracking-tighter">Ajustes de Publicación</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Fecha del Viaje</label>
              <input 
                type="date"
                value={formData.travel_date || ''}
                onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 px-6 rounded-2xl outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Estructura URL (Slug)</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                <input 
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 pl-12 pr-6 rounded-2xl outline-none transition-all text-xs text-zinc-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl">
               <span className="text-xs font-bold uppercase tracking-widest">Publicado</span>
               <button 
                type="button"
                onClick={() => setFormData({ ...formData, published: !formData.published })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative overflow-hidden",
                  formData.published ? "bg-black" : "bg-zinc-200"
                )}
               >
                 <motion.div 
                   animate={{ x: formData.published ? 24 : 4 }}
                   className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                 />
               </button>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
            <h3 className="text-xl font-serif font-bold tracking-tighter">Ubicación</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Región</label>
                <select 
                  value={formData.region_id || ''}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 px-6 rounded-2xl outline-none transition-all shadow-sm text-sm"
                >
                  <option value="">Selecciona Región</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Comuna</label>
                <select 
                  value={formData.comuna_id || ''}
                  onChange={(e) => setFormData({ ...formData, comuna_id: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 px-6 rounded-2xl outline-none transition-all shadow-sm text-sm"
                  disabled={!formData.region_id}
                >
                  <option value="">Selecciona Comuna</option>
                  {comunas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
            <h3 className="text-xl font-serif font-bold tracking-tighter">Multimedia</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 px-4">Imagen de Portada (URL)</label>
                <input 
                  type="text"
                  value={formData.cover_image || ''}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-100 focus:border-black h-14 px-6 rounded-2xl outline-none transition-all shadow-sm text-xs text-zinc-400"
                  placeholder="URL de Cloudinary o Unsplash"
                />
              </div>
              {formData.cover_image && (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
                  <img src={formData.cover_image} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
