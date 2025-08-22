// components/CascadingMenu.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MenuItem, MenuColumn } from '@/app/data/menuData';
import { FiChevronRight } from 'react-icons/fi';

type CascadingMenuProps = {
  menuItem: MenuItem;
};

export const CascadingMenu: React.FC<CascadingMenuProps> = ({ menuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  // State untuk melacak kategori yang di-hover, bukan diklik
  const [activeCategory, setActiveCategory] = useState<MenuColumn | null>(menuItem.columns[0] || null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div ref={menuRef} className="relative" onMouseLeave={() => setIsOpen(false)}>
      {/* Tombol Pemicu Utama - sekarang pakai onMouseEnter */}
      <div 
        onMouseEnter={() => setIsOpen(true)}
        className="h-14 flex items-center"
      >
        <Link href={menuItem.href} className="font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors">
          {menuItem.title}
        </Link>
      </div>

      {/* Panel Dropdown Utama dengan Layout 2 Kolom */}
      <div className={`
        absolute top-full left-1/2 -translate-x-1/2 mt-0
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
      `}>
        <div className="container mx-auto">
          <div className="w-screen max-w-4xl bg-white rounded-b-lg shadow-2xl flex border-t-2 border-blue-600">
            {/* Kolom Kiri: Daftar Kategori */}
            <div className="w-1/4 bg-slate-50 border-r border-slate-200 rounded-bl-lg">
              <ul className="p-4 space-y-1">
                {menuItem.columns.map((category) => (
                  <li key={category.heading}>
                    <button 
                      onMouseEnter={() => setActiveCategory(category)}
                      className={`w-full text-left flex justify-between items-center px-4 py-2 rounded-md transition-colors duration-150 ${activeCategory?.heading === category.heading ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      <span>{category.heading}</span>
                      <FiChevronRight size={16}/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolom Kanan: Daftar Item dari Kategori Aktif */}
            <div className="w-3/4 p-8">
              {activeCategory && (
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-4">
                    {activeCategory.heading}
                  </h3>
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {activeCategory.links.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} onClick={() => setIsOpen(false)} className="block py-1 text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-all">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};