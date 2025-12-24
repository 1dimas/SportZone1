"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/landing" className="flex items-center space-x-1">
          <span className="text-2xl font-bold text-gray-900">Sport</span>
          <span className="text-2xl font-bold text-orange-500">Zone</span>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/home" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300">
            Produk
          </Link>
          <Link href="/landing#about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300">
            Tentang
          </Link>
          <Link href="/landing#contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300">
            Kontak
          </Link>
        </nav>

        {/* Icon Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="p-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-300">
            <FiShoppingCart size={22} />
          </Link>
          <Link href="/login" className="p-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-300">
            <FiUser size={22} />
          </Link>
          <Link 
            href="/login" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Login
          </Link>
        </div>

        {/* Tombol Hamburger */}
        <div className="md:hidden flex items-center space-x-3">
          <Link href="/cart" className="p-2 text-gray-700 hover:text-orange-500 rounded-lg transition-colors duration-300">
            <FiShoppingCart size={22} />
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 text-gray-700 hover:text-orange-500 rounded-lg transition-colors duration-300"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-6 border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 pt-4">
            <Link 
              href="/home" 
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Produk
            </Link>
            <Link 
              href="/landing#about" 
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang
            </Link>
            <Link 
              href="/landing#contact" 
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 font-medium py-3 px-4 rounded-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiUser size={18} />
                Masuk
              </Link>
              <Link 
                href="/register" 
                className="text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;