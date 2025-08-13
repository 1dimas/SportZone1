// components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { FiSearch, FiMapPin, FiHeart, FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";
import { CascadingMenu } from "./CascadingMenu";
import { menuData } from "@/app/data/menuData";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      {/* BAGIAN ATAS HEADER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-3xl font-bold text-gray-800 transition-transform hover:scale-105"
            >
              Sport
            </Link>
            <Link
              href="/"
              className="text-3xl font-bold text-orange-600 transition-transform hover:scale-105"
            >
              Zone
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Cari di SportZone..."
                className="w-full py-2.5 pl-5 pr-12 text-gray-900 bg-slate-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-orange-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-orange-600"
                aria-label="Cari"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div>

          {/* Icon dan Tombol Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="p-2 rounded-full hover:bg-slate-100 transition-all hover:scale-110 hidden sm:flex"
              title="Lacak Pesanan"
              aria-label="Lacak Pesanan"
            >
              <FiMapPin size={22} />
            </button>

            <button
              className="p-2 rounded-full hover:bg-slate-100 transition-all hover:scale-110 hidden sm:flex"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <FiHeart size={22} />
            </button>

            <button
              className="relative p-2 rounded-full hover:bg-slate-100 transition-all hover:scale-110"
              title="Keranjang"
              aria-label="Keranjang Belanja"
            >
              <FiShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                3
              </span>
            </button>

            {/* Tombol Login */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all"
            >
              <FiUser size={18} />
              <span className="font-medium">Login</span>
            </Link>

            {/* Menu Mobile */}
            <div className="lg:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-slate-100"
                aria-label="Buka Menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi Desktop */}
      <div className="hidden lg:flex justify-center border-t border-gray-200">
        <nav className="flex items-center gap-8 h-14">
          {menuData.map((item) =>
            item.columns.length > 0 ? (
              <CascadingMenu key={item.title} menuItem={item} />
            ) : (
              <Link
                key={item.title}
                href={item.href}
                className="font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
