"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1">
          <span className="text-2xl font-bold text-gray-900">Sport</span>
          <span className="text-2xl font-bold text-orange-500">Zone</span>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#products" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300">Produk</Link>
          <Link href="#about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300">Tentang Kami</Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300">Kontak</Link>
        </nav>

        {/* Icon Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
            <FiShoppingCart size={24} />
          </button>
          <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
            <FiUser size={24} />
          </button>
          <Link href="/login" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
            Login
          </Link>
        </div>

        {/* Tombol Hamburger */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
            <FiShoppingCart size={24} />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-6 border-t border-gray-100">
          <nav className="flex flex-col space-y-4 pt-4">
            <Link href="#products" className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-300">Produk</Link>
            <Link href="#about" className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-300">Tentang Kami</Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-medium py-2 transition-colors duration-300">Kontak</Link>
            <div className="pt-4">
              <Link href="/login" className="w-full text-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 block">
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;