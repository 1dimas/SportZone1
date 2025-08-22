'use client';

import { useState } from 'react';
import Link from 'next/link';
import { menuData, MenuColumn } from '@/app/data/menuData';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

// Komponen ini menerima satu prop: sebuah fungsi untuk menutup panel utama
export const MobileNavMenu = ({ onLinkClick }: { onLinkClick: () => void }) => {
  // State untuk melacak kategori mana yang sedang aktif/terbuka
  const [activeCategory, setActiveCategory] = useState<MenuColumn | null>(null);

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
        <div className="p-4 flex flex-col">
          {menuData.map((item) => (
            // Jika item punya submenu, jadikan tombol. Jika tidak, jadikan link.
            item.columns.length > 0 ? (
              <button
                key={item.title}
                onClick={() => handleCategoryClick(item.columns[0])} // Asumsi kita masuk ke kolom pertama
                className="flex justify-between items-center w-full px-4 py-3 rounded-md text-gray-700 font-semibold hover:text-orange-600 hover:bg-slate-100 text-left"
              >
                <span>{item.title}</span>
                <FiChevronRight />
              </button>
            ) : (
              <Link
                key={item.title}
                href={item.href}
                onClick={onLinkClick}
                className="block px-4 py-3 rounded-md text-gray-700 font-semibold hover:text-orange-600 hover:bg-slate-100"
              >
                {item.title}
              </Link>
            )
          ))}
        </div>
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