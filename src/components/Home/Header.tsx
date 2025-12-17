"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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

import { useCart } from "@/context/cart-context";
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
import { getMenuData } from "@/components/lib/services/menu.service";
import { MenuItem } from "@/app/data/menuData";
import { logout, getProfile } from "@/components/lib/services/auth.service";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const { state: cartState } = useCart();

  // Calculate total cart items
  const cartItemCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State for fetched menu data
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch menu data
    const fetchMenu = async () => {
      try {
        setMenuLoading(true);
        const data = await getMenuData();
        setMenuData(data);
      } catch (err) {
        setMenuError(err instanceof Error ? err.message : "Failed to load menu");
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();

    // Check for login token and fetch user profile
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token) {
      setIsLoggedIn(true);
      if (storedUserId) setUserId(storedUserId);
      
      // Fetch user profile to get username
      getProfile()
        .then((profile) => {
          setUsername(profile.username || profile.nama || "User");
        })
        .catch(() => {
          setUsername("User");
        });
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
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
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

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenCategory(null); // Close accordion on menu close
  }

  const handleLogout = async () => {
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
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const sportsMenuItem = menuData.find(item => item.title === 'SPORTS');

  return (
    <>
      <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
        <div
          className={`
            container mx-auto px-4 sm:px-6 lg:px-8
            ${isSearchOpen ? "hidden" : "block"}
          `}
        >
          <div className="flex items-center justify-between h-20 gap-4">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/images/LOgobaru.png"
                alt="SportZone Logo"
                width={56}
                height={56}
                className="h-14 w-14"
              />
              <span className="hidden sm:block text-2xl font-bold text-gray-900">
                Sport<span className="text-orange-500">Zone</span>
              </span>
            </Link>

            <div className="flex-1 flex justify-center items-center gap-4">
              <div className="hidden lg:flex items-center">
                {menuLoading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : menuError ? (
                  <p className="text-sm text-red-500">Error</p>
                ) : (
                  sportsMenuItem && <CascadingMenu menuItem={sportsMenuItem} />
                )}
              </div>
            </div>

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
                className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
              >
                <FiShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg animate-pulse">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
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
                        <span className="hidden md:block font-medium">
                          Akun
                        </span>
                        <FiChevronDown size={16} className="hidden md:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>
                        Hallo, {username || "User"}!
                      </DropdownMenuLabel>
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

        {isSearchOpen && (
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-20 gap-4">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/images/LOgobaru.png"
                  alt="SportZone Logo"
                  width={56}
                  height={56}
                  className="h-14 w-14"
                />
                <span className="hidden sm:block text-2xl font-bold text-gray-900">
                  Sport<span className="text-orange-500">Zone</span>
                </span>
              </Link>
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

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="fixed inset-0 bg-black/40" onClick={closeMenu}></div>
          <div className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-white z-50 p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <span className="text-2xl font-bold text-gray-900">
                  Sport<span className="text-orange-500">Zone</span>
                </span>
              </Link>
            </div>

            <nav className="flex flex-col gap-1">
              <span className="py-2 px-3 font-bold text-gray-900 text-lg">
                Kategori Olahraga
              </span>
              {menuLoading ? (
                <p className="text-sm text-gray-500 p-3">Loading...</p>
              ) : menuError ? (
                <p className="text-sm text-red-500 p-3">Gagal memuat kategori.</p>
              ) : (
                sportsMenuItem?.columns.map((column) => (
                  <div key={column.heading}>
                    <button
                      onClick={() => setOpenCategory(openCategory === column.heading ? null : column.heading)}
                      className="w-full flex justify-between items-center py-2.5 px-3 rounded-lg text-base text-gray-700 hover:bg-gray-100 hover:text-orange-500 transition-colors"
                    >
                      <span>{column.heading}</span>
                      <FiChevronDown
                        className={`transform transition-transform ${
                          openCategory === column.heading ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openCategory === column.heading && (
                      <div className="pl-6 pr-2 pt-1 pb-2 flex flex-col gap-1 border-l ml-3">
                        {column.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className="py-2 px-3 rounded-lg text-base text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition-colors block"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </nav>

            <div className="flex flex-col gap-3 mb-6 mt-6 border-t pt-6">
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
                  <Link href="/profile" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      className="w-full border-orange-500 text-orange-500"
                    >
                      <FiUser className="mr-2" /> Profil Saya
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
          </div>
        </div>
      )}
    </>
  );
}
