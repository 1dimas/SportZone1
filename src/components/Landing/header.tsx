"use client"; // <-- Tambahkan ini di baris paling atas!

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Menggunakan react-icons untuk ikon

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-slate-800">
          Sport<Link href="/" className="text-2xl font-bold text-orange-500">
          Zone
        </Link>
        </Link>


        {/* Navigasi Desktop (Terlihat di layar medium ke atas) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#products" className="text-slate-600 hover:text-blue-600">Produk</Link>
          <Link href="#About" className="text-slate-600 hover:text-blue-600">Tentang Kami</Link>
          <Link href="/contact" className="text-slate-600 hover:text-blue-600">Kontak</Link>
        </nav>

        {/* Tombol Login Desktop (Terlihat di layar medium ke atas) */}
        <div className="hidden md:block">
          <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors">
            Login
          </Link>
        </div>

        {/* Tombol Hamburger (Hanya terlihat di layar kecil) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile (Muncul/Hilang berdasarkan state isMenuOpen) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 border-t">
          <nav className="flex flex-col space-y-3 pt-3">
            <Link href="/products" className="text-slate-600 hover:text-blue-600">Produk</Link>
            <Link href="/Aboutme" className="text-slate-600 hover:text-blue-600">Tentang Kami</Link>
            <Link href="/contact" className="text-slate-600 hover:text-blue-600">Kontak</Link>
            <hr/>
            {/* Tombol Login sekarang ada di sini untuk versi mobile */}
            <Link href="/login" className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;