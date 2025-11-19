'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuColumn } from '@/app/data/menuData';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { getAllKategoriOlahraga } from '@/components/lib/services/olahraga.service';
import { getSubkategoriPeralatanByKategoriOlahraga } from '@/components/lib/services/subkategori-peralatan.service';

type KategoriOlahraga = {
  id: string;
  nama: string;
};

type SubkategoriPeralatan = {
  id: string;
  nama: string;
  kategori_olahraga_id: string;
};

// Komponen ini menerima satu prop: sebuah fungsi untuk menutup panel utama
export const MobileNavMenu = ({ onLinkClick }: { onLinkClick: () => void }) => {
  const [activeCategory, setActiveCategory] = useState<MenuColumn | null>(null);
  const [categories, setCategories] = useState<MenuColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const kategoriData = await getAllKategoriOlahraga() as KategoriOlahraga[];
        
        const menuColumns: MenuColumn[] = await Promise.all(
          kategoriData.map(async (kategori) => {
            const subkategoriData = await getSubkategoriPeralatanByKategoriOlahraga(kategori.id) as SubkategoriPeralatan[];
            
            return {
              heading: kategori.nama.toUpperCase(),
              links: subkategoriData.map((sub) => ({
                name: sub.nama,
                href: `/sports/${kategori.nama.toLowerCase()}/${sub.nama.toLowerCase().replace(/\s+/g, '-')}`
              }))
            };
          })
        );

        setCategories(menuColumns);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fungsi untuk menangani saat kategori di-klik
  const handleCategoryClick = (category: MenuColumn) => {
    setActiveCategory(category);
  };

  // Fungsi untuk menangani saat tombol "Back" di-klik
  const handleBackClick = () => {
    setActiveCategory(null); // Kembali ke menu utama
  };

  return (
    // Container utama dengan overflow hidden untuk efek sliding
    <div className="relative overflow-x-hidden h-full">
      {/* Panel 1: Menu Utama (Daftar Kategori Induk) */}
      <div 
        className={`
          w-full absolute top-0 left-0 transition-transform duration-300 ease-in-out
          ${activeCategory ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="p-4 flex flex-col">
            {categories.map((category) => (
              <button
                key={category.heading}
                onClick={() => handleCategoryClick(category)}
                className="flex justify-between items-center w-full px-4 py-3 rounded-md text-gray-700 font-semibold hover:text-orange-600 hover:bg-slate-100 text-left"
              >
                <span>{category.heading}</span>
                <FiChevronRight />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panel 2: Sub-Menu (Daftar Link di dalam kategori) */}
      <div 
        className={`
          w-full absolute top-0 left-0 transition-transform duration-300 ease-in-out h-full overflow-y-auto
          ${activeCategory ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {activeCategory && (
          <div className="p-4 flex flex-col">
            {/* Tombol Kembali */}
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-md text-gray-700 font-bold hover:text-orange-600 hover:bg-slate-100 text-left mb-2"
            >
              <FiChevronLeft />
              <span>{activeCategory.heading}</span>
            </button>
            
            <hr/>

            {/* Daftar Link Sub-item */}
            {activeCategory.links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onLinkClick} // Tutup seluruh panel saat link diklik
                className="block px-4 py-3 rounded-md text-gray-600 hover:text-orange-600 hover:bg-slate-100"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};