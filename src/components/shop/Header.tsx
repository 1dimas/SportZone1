"use client";

import Link from "next/link";
import { FiSearch, FiMapPin, FiHeart, FiShoppingCart, FiMenu } from "react-icons/fi";

export default function Header() {
  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              SportZone
            </Link>
          </div>

          {/* Search Bar - Lebih dominan di tengah */}
          <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Cari produk, merek, atau olahraga..."
                className="w-full py-2 pl-4 pr-12 text-gray-900 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-600 hover:text-blue-600 transition-colors rounded-full"
                aria-label="Cari"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div>
          
          {/* Action Icons & Desktop Nav */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 mr-4">
              <Link href="/shop" className="text-gray-600 hover:text-blue-600 transition-colors">Shop</Link>
              <Link href="/sports" className="text-gray-600 hover:text-blue-600 transition-colors">Sports</Link>
              <Link href="/brands" className="text-gray-600 hover:text-blue-600 transition-colors">Brands</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Lacak Pesanan">
                <FiMapPin size={22} />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Wishlist">
                <FiHeart size={22} />
              </button>
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Keranjang Belanja">
                <FiShoppingCart size={22} />
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  3
                </span>
              </button>
            </div>
            
            {/* Hamburger for mobile */}
            <div className="lg:hidden ml-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Buka Menu">
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}