// components/Header.tsx
"use client";

import Link from "next/link";
import { useState, ReactNode } from "react"; // Impor ReactNode
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX, FiUser } from "react-icons/fi";


// 1. Ubah props untuk menerima 'children'
type HeaderProps = {
  children?: ReactNode; // 'children' adalah konten yang akan kita "suntikkan"
}

export default function Header({ children }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      {/* BAGIAN ATAS HEADER (tetap sama) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
            {/* ... Logo, Search Bar, Ikon Aksi, Tombol Login, Hamburger ... */}
            {/* Semua kode di sini tidak perlu diubah */}
            <div className="flex-shrink-0 flex items-baseline">
                <Link href="homepage"  className="text-3xl font-bold text-gray-800">Sport</Link>
                <Link href="homepage" className="text-3xl font-bold text-orange-600">Zone</Link>
            </div>
            <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">{/*...Search Bar...*/}</div>
            <div className="flex items-center gap-2 sm:gap-3">{/*...Ikon, Login, Hamburger...*/}</div>
        </div>
      </div>

      {/* 2. BAGIAN BAWAH HEADER (Navigasi / Breadcrumbs) */}
      {/* Di sinilah 'children' akan dirender. */}
      {/* Jika kita memberikan anak, anak itu akan muncul di sini. */}
      {/* Jika tidak, tidak akan ada apa-apa. */}
      {children}
      
      {/* PANEL MENU MOBILE (tetap sama) */}
      
    </header>
  );
}