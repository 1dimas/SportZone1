// components/CascadingMenu.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MenuItem, MenuColumn } from '@/app/data/menuData';
import { FiChevronRight } from 'react-icons/fi';
import { getAllKategoriOlahraga } from '@/components/lib/services/olahraga.service';
import { getSubkategoriPeralatanByKategoriOlahraga } from '@/components/lib/services/subkategori-peralatan.service';

type CascadingMenuProps = {
  menuItem: MenuItem;
};

type KategoriOlahraga = {
  id: string;
  nama: string;
};

type SubkategoriPeralatan = {
  id: string;
  nama: string;
  kategori_olahraga_id: string;
};

export const CascadingMenu: React.FC<CascadingMenuProps> = ({ menuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<MenuColumn[]>(menuItem.columns);
  const [activeCategory, setActiveCategory] = useState<MenuColumn | null>(categories[0] || null);
  const [isLoading, setIsLoading] = useState(true);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const kategoriData = await getAllKategoriOlahraga() as KategoriOlahraga[];
        
        const menuColumns: MenuColumn[] = await Promise.all(
          kategoriData.map(async (kategori) => {
            const subkategoriData = await getSubkategoriPeralatanByKategoriOlahraga(kategori.id) as SubkategoriPeralatan[];
            
            return {
              heading: kategori.nama.toUpperCase(),
              kategoriHref: `/sports/${kategori.nama.toLowerCase()}`,
              links: subkategoriData.map((sub) => ({
                name: sub.nama,
                href: `/sports/${kategori.nama.toLowerCase()}/${sub.nama.toLowerCase().replace(/\s+/g, '-')}`
              }))
            };
          })
        );

        setCategories(menuColumns);
        setActiveCategory(menuColumns[0] || null);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <Link href={menuItem.href} className="font-semibold text-gray-700 uppercase tracking-wider hover:text-orange-600 transition-colors">
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
          <div className="w-screen max-w-4xl bg-white rounded-b-lg shadow-2xl flex border-t-2 border-orange-600">
            {/* Kolom Kiri: Daftar Kategori */}
            <div className="w-1/4 bg-slate-50 border-r border-slate-200 rounded-bl-lg">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : (
                <ul className="p-4 space-y-1">
                  {categories.map((category) => (
                    <li key={category.heading}>
                      <Link
                        href={category.kategoriHref || '#'}
                        onMouseEnter={() => setActiveCategory(category)}
                        className={`w-full text-left flex justify-between items-center px-4 py-2 rounded-md transition-colors duration-150 block ${activeCategory?.heading === category.heading ? 'bg-blue-100 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        <span>{category.heading}</span>
                        <FiChevronRight size={16}/>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
                        <Link href={link.href} onClick={() => setIsOpen(false)} className="block py-1 text-slate-600 hover:text-orange-600 hover:translate-x-1 transition-all">
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