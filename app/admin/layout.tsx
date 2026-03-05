'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Map as MapIcon, 
  LogOut, 
  ChevronRight,
  Bike
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check session
    const isAdmin = localStorage.getItem('atisbo_admin_session');
    if (isAdmin !== 'true') {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('atisbo_admin_session');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-black"
        >
          <Bike size={48} />
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect via useEffect
  }

  const navItems = [
    { name: 'Resumen', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Bitácoras', href: '/admin/posts', icon: <FileText size={20} /> },
    { name: 'Galería', href: '/admin/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Mapa & Progreso', href: '/admin/map', icon: <MapIcon size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-zinc-100 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-zinc-50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-black text-white rounded-2xl group-hover:rotate-12 transition-transform">
              <Bike size={24} />
            </div>
            <span className="font-bold tracking-tighter text-2xl uppercase">Atisbo</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 mt-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-300 px-4 mb-4">Menú Principal</p>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all group",
                pathname === item.href 
                  ? "bg-black text-white shadow-xl" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-black"
              )}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight 
                size={16} 
                className={cn(
                  "opacity-0 transition-opacity",
                  pathname === item.href ? "opacity-100" : "group-hover:opacity-40"
                )} 
              />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 min-h-screen">
        <div className="p-12 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
