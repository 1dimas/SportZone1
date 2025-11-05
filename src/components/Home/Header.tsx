// components/Home/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
// Asumsi lo pake shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Import Button

import { CascadingMenu } from "./CascadingMenu";
import { menuData } from "@/app/data/menuData";
import { logout } from "@/components/lib/services/auth.service";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token) {
      setIsLoggedIn(true);
      if (storedUserId) {
        setUserId(storedUserId);
      }
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
          const decodedToken = JSON.parse(atob(tokenFromUrl.split('.')[1]));
          // Backend uses `sub` for user id; keep backward compatibility with `userId`
          const uid = decodedToken.userId || decodedToken.sub;
          if (uid) {
            localStorage.setItem("userId", String(uid));
            setUserId(String(uid));
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
        }
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
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
      closeMenu();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      // Force logout on UI even if API fails
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      closeMenu();
      router.push("/login");
    }
  };

  return (
    <>
      <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
        {/* =======================================================
          BAGIAN ATAS HEADER (Logo, Search, Icons)
          ======================================================= */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Dibenahi jadi 1 Link + Gambar */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                
                <span className="hidden sm:block text-2xl font-bold text-gray-900">
                  Sport
                  <span className="text-orange-500">Zone</span>
                </span>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
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

            {/* Icon dan Tombol Login/User - Dibenahi */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart - Dibenahi jadi Link */}
              <Link
                href="/cart"
                className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
                aria-label="Keranjang Belanja"
              >
                <FiShoppingCart size={22} />
              </Link>

              {/* Garis Pemisah Visual */}
              <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

              {/* Tombol Login atau User Dropdown - Dibenahi */}
              <div className="hidden sm:flex">
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-700 hover:text-orange-500"
                      >
                        <FiUser size={18} />
                        <span className="hidden md:block font-medium">
                          Akun Saya
                        </span>
                        <FiChevronDown size={16} className="hidden md:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Halo!</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/pesanan/history"
                          className="flex items-center"
                        >
                          <FiList className="mr-2 h-4 w-4" />
                          <span>Riwayat Pesanan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profile`} className="flex items-center">
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

              {/* Menu Mobile Button */}
              <div className="flex items-center lg:hidden ml-2">
                {/* Ikon search mobile jika perlu */}
                {/* <button className="p-2 text-gray-700 ..."><FiSearch/></button> */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Buka Menu"
                >
                  <FiMenu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
          NAVIGASI KATEGORI - DESKTOP
          ======================================================= */}
        <div className="hidden lg:flex justify-center border-t border-gray-100 bg-white">
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

      {/* =======================================================
        MENU MOBILE OVERLAY - INI IMPLEMENTASI BARU
        ======================================================= */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={closeMenu}
          ></div>

          {/* Panel Menu */}
          <div className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-white z-50 p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-600"
                aria-label="Tutup Menu"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Auth Buttons Mobile */}
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

            {/* Nav Links Mobile */}
            <nav className="flex flex-col gap-2 border-t pt-6">
              {menuData.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={closeMenu}
                  className="py-3 px-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-orange-500"
                >
                  {item.title}
                </Link>
                // Di sini bisa ditambahkan logika untuk render sub-menu jika perlu
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
