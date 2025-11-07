"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// --- 1. IMPORT IMAGE ---
import Image from "next/image"; 
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiList,
  FiChevronDown,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CascadingMenu } from "./CascadingMenu";
import { menuData } from "@/app/data/menuData";
import { logout } from "@/components/lib/services/auth.service";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // ... (Kode useEffect Anda untuk token tetap di sini)
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token) {
      setIsLoggedIn(true);
      if (storedUserId) setUserId(storedUserId);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl =
        urlParams.get("token") ||
        urlParams.get("access_token") ||
        urlParams.get("accessToken");
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        setIsLoggedIn(true);
        try {
          const decoded = JSON.parse(atob(tokenFromUrl.split(".")[1]));
          const uid = decoded.userId || decoded.sub;
          if (uid) {
            localStorage.setItem("userId", String(uid));
            setUserId(String(uid));
          }
        } catch (err) {
          console.error("Failed to decode token:", err);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    // ... (Kode handleLogout Anda)
    try {
      await logout();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/login");
    } catch {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/search?q=${searchQuery}`);

    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
        {/*
          =======================================================
          TAMPILAN HEADER NORMAL
          =======================================================
        */}
        <div
          className={`
            container mx-auto px-4 sm:px-6 lg:px-8
            ${isSearchOpen ? "hidden" : "block"}
          `}
        >
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* --- 2. LOGO HEADER NORMAL DIUBAH --- */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              {/* Ganti "logo-sz.png" jika nama file Anda berbeda */}
              <Image
                src="/images/logo.png"
                alt="SportZone Logo"
                width={40}
                height={40}
                className="h-10 w-10" // Sesuaikan ukuran (misal: h-10 w-10)
              />
              <span className="hidden sm:block text-2xl font-bold text-gray-900">
                Sport<span className="text-orange-500">Zone</span>
              </span>
            </Link>
            {/* --- --------------------------- --- */}

            {/* Menu SPORTS */}
            <div className="flex-1 flex justify-center items-center gap-4">
              <div className="hidden lg:flex items-center">
                {menuData
                  .filter((item) => item.title === "SPORTS")
                  .map((item) =>
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
              </div>
            </div>

            {/* Icon dan Akun */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
                aria-label="Buka Pencarian"
              >
                <FiSearch size={22} />
              </button>
              <Link
                href="/cart"
                className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <FiShoppingCart size={22} />
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
              <div className="hidden sm:flex">
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-700 hover:text-orange-500"
                      >
                        <FiUser size={18} />
                        <span className="hidden md:block font-medium">Akun</span>
                        <FiChevronDown size={16} className="hidden md:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Halo!</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/pesanan/history" className="flex items-center">
                          <FiList className="mr-2 h-4 w-4" />
                          <span>Riwayat Pesanan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <FiUser className="mr-2 h-4 w-4" />
                          <span>Profil Saya</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-500"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                      <FiUser size={18} className="mr-0 sm:mr-2" />
                      <span className="hidden sm:block">Login</span>
                    </Button>
                  </Link>
                )}
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Buka Menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* TAMPILAN SEARCH BAR (Saat Terbuka) */}
        {isSearchOpen && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-20 gap-4">
              
              {/* --- 3. LOGO HEADER SEARCH DIUBAH --- */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/logo-sz.png"
                  alt="SportZone Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="hidden sm:block text-2xl font-bold text-gray-900">
                  Sport<span className="text-orange-500">Zone</span>
                </span>
              </Link>
              {/* --- -------------------------- --- */}

              <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari di SportZone..."
                  className="w-full py-2.5 pl-5 pr-12 text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-700 hover:text-orange-500"
                aria-label="Tutup Pencarian"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ======================================================= */}
      {/* ================ MENU MOBILE (MODIFIED) =============== */}
      {/* ======================================================= */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="fixed inset-0 bg-black/40" onClick={closeMenu}></div>
          <div className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-white z-50 p-6 shadow-xl overflow-y-auto">
            
            {/* --- 4. HEADER MENU MOBILE DIUBAH --- */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/logo-sz.png"
                  alt="SportZone Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="text-2xl font-bold text-gray-900">
                  Sport<span className="text-orange-500">Zone</span>
                </span>
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-600"
                aria-label="Tutup Menu"
              >
                <FiX size={24} />
              </button>
            </div>
            {/* --- --------------------------- --- */}

            <div className="flex flex-col gap-3 mb-6">
              {isLoggedIn ? (
                <>
                  <Link href="/pesanan/history" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      className="w-full border-orange-500 text-orange-500"
                    >
                      <FiList className="mr-2" /> Riwayat Pesanan
                    </Button>
                  </Link>

                  {/* --- 5. TOMBOL PROFIL DIKEMBALIKAN --- */}
                  <Link href="/profile" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      className="w-full border-orange-500 text-orange-500"
                    >
                      <FiUser className="mr-2" /> Profil Saya
                    </Button>
                  </Link>
                  {/* --- ----------------------------- --- */}

                  <Button
                    variant="outline"
                    className="w-full text-red-500 border-red-500"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                    <FiUser className="mr-2" /> Login / Daftar
                  </Button>
                </Link>
              )}
            </div>

            {/* Navigasi Kategori */}
            <nav className="flex flex-col gap-2 border-t pt-6">
              {menuData.map((item) =>
                item.title === "SPORTS" && item.columns.length > 0 ? (
                  <div key={item.title} className="flex flex-col">
                    <span className="py-3 px-3 rounded-lg font-medium text-gray-900 text-base">
                      {item.title}
                    </span>
                    <div className="flex flex-col pl-5 pt-1 gap-1 border-l ml-3">
                      {item.columns.map((column, colIndex) =>
                        column.links.map((link) => (
                          <Link
                            key={`${colIndex}-${link.text}`}
                            href={link.href}
                            onClick={closeMenu}
                            className="py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                          >
                            {link.text}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={closeMenu}
                    className="py-3 px-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-orange-500"
                  >
                    {item.title}
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}