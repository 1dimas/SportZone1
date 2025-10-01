// components/Home/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";
import { CascadingMenu } from "./CascadingMenu";
import { menuData } from "@/app/data/menuData";
import { logout } from "@/components/lib/services/auth.service";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      // Check if token is in URL (for Google login)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        setIsLoggedIn(true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      {/* BAGIAN ATAS HEADER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-3xl font-bold text-gray-900 transition-transform hover:scale-105"
            >
              Sport
            </Link>
            <Link
              href="/"
              className="text-3xl font-bold text-orange-500 transition-transform hover:scale-105"
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
                className="w-full py-2.5 pl-5 pr-12 text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-orange-500"
                aria-label="Cari"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div>

          {/* Icon dan Tombol Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Icons */}
            <div className="hidden sm:flex items-center gap-4">
              <button className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <FiHeart size={22} />
              </button>
              <button className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
                <FiShoppingCart size={22} />
              </button>
            </div>

            {/* Tombol Login atau Logout */}
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

            {/* Menu Mobile */}
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

      {/* Navigasi Desktop */}
      <div className="hidden lg:flex justify-center border-t border-gray-100">
        <nav className="flex items-center gap-8 h-14">
          {menuData.map((item) =>
            item.columns.length > 0 ? (
              <CascadingMenu key={item.title} menuItem={item} />
            ) : (
              <Link
                key={item.title}
                href={item.href}
                className="font-medium text-gray-700 hover:text-orange-500 transition-colors"
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
