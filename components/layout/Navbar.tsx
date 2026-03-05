'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bike } from 'lucide-react';
import { cn } from '@/utils/cn';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Mapa', href: '/mapa' },
  { name: 'Bitácora', href: '/blog' },
  { name: 'Galería', href: '/galeria' },
  { name: 'El Proyecto', href: '/proyecto' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkPage = pathname === '/' || pathname?.startsWith('/blog/');
  const shouldShowDarkNavbar = isScrolled || isOpen || !isDarkPage;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        shouldShowDarkNavbar
          ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm text-black'
          : 'bg-transparent py-6 text-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 15 }}
            className={cn(
              'p-2 rounded-full transition-colors',
              shouldShowDarkNavbar ? 'bg-black text-white' : 'bg-white text-black'
            )}
          >
            <Bike size={20} />
          </motion.div>
          <span className="font-bold tracking-tighter text-xl uppercase">Atisbo</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-opacity hover:opacity-100',
                pathname === item.href ? 'opacity-100' : 'opacity-70'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-lg font-medium text-black',
                    pathname === item.href ? 'opacity-100' : 'opacity-60'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
