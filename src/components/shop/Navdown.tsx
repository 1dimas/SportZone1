// components/Dropdown.tsx
"use client"; // <-- WAJIB! karena kita akan menggunakan React Hooks (useState, useEffect)

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";

// Definisikan tipe untuk props
type DropdownProps = {
  trigger: ReactNode; // Komponen yang akan menjadi pemicu dropdown (misal: tombol atau gambar)
  children: ReactNode; // Konten dari menu dropdown itu sendiri
};

const Dropdown: React.FC<DropdownProps> = ({ trigger, children }) => {
  // State untuk mengontrol status buka/tutup dropdown
  const [isOpen, setIsOpen] = useState(false);

// Di dalam komponen Dropdown, setelah useState

useEffect(() => {
  // Fungsi untuk menangani klik di luar komponen
  const handleClickOutside = (event: MouseEvent) => {
    // Jika ref ada dan klik terjadi di luar elemen yang direferensikan
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Tutup dropdown
    }
  };

  // Tambahkan event listener saat komponen di-mount
  document.addEventListener('mousedown', handleClickOutside);

  // Bersihkan event listener saat komponen di-unmount (PENTING!)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, ); // Dependensi array, agar effect hanya berjalan sekali saat mount dan unmount

// ... sisa kode komponen ...
  // useRef untuk mendapatkan referensi ke elemen DOM utama dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logika untuk menutup dropdown akan kita tambahkan di sini nanti

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Tombol Pemicu Dropdown */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* Menu Dropdown yang akan muncul/hilang */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
