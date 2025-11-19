"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service";

type KategoriOlahraga = {
  id: string;
  nama: string;
};

export default function SportsPage() {
  const [categories, setCategories] = useState<KategoriOlahraga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const kategoriData = (await getAllKategoriOlahraga()) as KategoriOlahraga[];
        setCategories(kategoriData);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Gagal memuat kategori. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kategori Olahraga
            </h1>
            <p className="text-gray-600">
              Pilih kategori olahraga untuk melihat produk
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat kategori...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && categories.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Belum Ada Kategori
              </h2>
              <p className="text-gray-600">
                Saat ini belum ada kategori olahraga tersedia.
              </p>
            </div>
          )}

          {/* Categories Grid */}
          {!isLoading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((kategori) => (
                <Link
                  key={kategori.id}
                  href={`/sports/${kategori.nama.toLowerCase()}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {kategori.nama}
                      </h2>
                    </div>
                    <FiChevronRight
                      className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all"
                      size={24}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
