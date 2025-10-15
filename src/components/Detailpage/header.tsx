// components/Header.tsx
"use client";

import Link from "next/link";
import { useState, ReactNode, useEffect } from "react";
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

// 1. Ubah props untuk menerima 'children'
type HeaderProps = {
  children?: ReactNode; // 'children' adalah konten yang akan kita "suntikkan"
}

export default function Header({ children }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state: cartState } = useCart();
  const router = useRouter();
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalItems = cartState.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      {/* BAGIAN ATAS HEADER (tetap sama) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-baseline">
            <Link href="/" className="text-3xl font-bold text-gray-800">Sport</Link>
            <Link href="/" className="text-3xl font-bold text-orange-600">Zone</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
            <form onSubmit={handleSearch} className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Cari di SportZone..."
                className="w-full py-2.5 pl-5 pr-12 text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-orange-500"
                aria-label="Cari"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </div>

          {/* Icons and Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Icons */}
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/pages/wishlist" className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <FiHeart size={22} />
              </Link>
              <Link href="/cart" className="p-2 text-gray-700 hover:text-orange-500 relative transition-colors">
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Login or Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
              >
                <FiUser size={18} />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
              >
                <FiUser size={18} />
                <span className="font-medium">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Buka Menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="font-medium text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={closeMenu}
              >
                Beranda
              </Link>
              <Link 
                href="/products" 
                className="font-medium text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={closeMenu}
              >
                Produk
              </Link>
              <Link 
                href="/categories" 
                className="font-medium text-gray-700 hover:text-orange-500 transition-colors py-2"
                onClick={closeMenu}
              >
                Kategori
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="text-left font-medium text-gray-700 hover:text-orange-500 transition-colors py-2"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="font-medium text-gray-700 hover:text-orange-500 transition-colors py-2"
                  onClick={closeMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BAGIAN BAWAH HEADER (Navigasi / Breadcrumbs) */}
      {/* Di sinilah 'children' akan dirender. */}
      {/* Jika kita memberikan anak, anak itu akan muncul di sini. */}
      {/* Jika tidak, tidak akan ada apa-apa. */}
      {children}
    </header>
  );
}