"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service";
import { getSubkategoriPeralatanByKategoriOlahraga } from "@/components/lib/services/subkategori-peralatan.service";
import { getProdukBySubkategori } from "@/components/lib/services/produk.service";

type Params = {
  kategori: string;
  subkategori: string;
};

type KategoriOlahraga = {
  id: string;
  nama: string;
};

type SubkategoriPeralatan = {
  id: string;
  nama: string;
  kategori_olahraga_id: string;
};

type Produk = {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambar: string[];
  subkategori_id: string;
  brand_id: string;
  status: string;
  brand?: {
    id: string;
    nama: string;
  };
  subkategoriPeralatan?: {
    id: string;
    nama: string;
  };
};

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export default function SubkategoriPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolvedParams = React.use(params);
  const { kategori, subkategori } = resolvedParams;
  const router = useRouter();

  const [products, setProducts] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kategoriName, setKategoriName] = useState("");
  const [subkategoriName, setSubkategoriName] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching kategori:", kategori);
        const kategoriData = (await getAllKategoriOlahraga()) as KategoriOlahraga[];
        console.log("All kategori data:", kategoriData);
        
        const foundKategori = kategoriData.find(
          (k) => k.nama.toLowerCase() === decodeURIComponent(kategori).toLowerCase()
        );

        if (!foundKategori) {
          console.log("Kategori not found");
          setError("Kategori tidak ditemukan");
          setIsLoading(false);
          return;
        }

        console.log("Found kategori:", foundKategori);
        setKategoriName(foundKategori.nama);

        const subkategoriData = (await getSubkategoriPeralatanByKategoriOlahraga(
          foundKategori.id
        )) as SubkategoriPeralatan[];
        console.log("All subkategori data:", subkategoriData);
        
        const decodedSubkategori = decodeURIComponent(subkategori).toLowerCase();
        console.log("Looking for subkategori slug:", decodedSubkategori);
        
        // Coba beberapa metode matching
        let foundSubkategori = subkategoriData.find(
          (s) => s.nama.toLowerCase().replace(/\s+/g, "-") === decodedSubkategori
        );
        
        // Fallback 1: Coba tanpa replace spasi
        if (!foundSubkategori) {
          console.log("Trying fallback 1: exact name match");
          foundSubkategori = subkategoriData.find(
            (s) => s.nama.toLowerCase() === decodedSubkategori
          );
        }
        
        // Fallback 2: Coba dengan replace - ke spasi
        if (!foundSubkategori) {
          console.log("Trying fallback 2: slug to name");
          const nameFromSlug = decodedSubkategori.replace(/-/g, " ");
          foundSubkategori = subkategoriData.find(
            (s) => s.nama.toLowerCase() === nameFromSlug
          );
        }
        
        // Fallback 3: Coba partial match
        if (!foundSubkategori) {
          console.log("Trying fallback 3: partial match");
          foundSubkategori = subkategoriData.find(
            (s) => s.nama.toLowerCase().includes(decodedSubkategori) ||
                   decodedSubkategori.includes(s.nama.toLowerCase())
          );
        }

        if (!foundSubkategori) {
          console.log("Subkategori not found after all fallbacks");
          console.log("Available subkategori names:", subkategoriData.map(s => s.nama));
          setError("Subkategori tidak ditemukan");
          setIsLoading(false);
          return;
        }

        console.log("Found subkategori:", foundSubkategori);
        setSubkategoriName(foundSubkategori.nama);

        const produkData = (await getProdukBySubkategori(
          foundSubkategori.id
        )) as Produk[];
        console.log("All produk data:", produkData);
        console.log("Number of products:", produkData.length);
        
        // Log detail setiap produk untuk debugging
        produkData.forEach((p, index) => {
          console.log(`Product ${index + 1}:`, {
            id: p.id,
            nama: p.nama,
            stok: p.stok,
            status: p.status,
            subkategori_id: p.subkategori_id,
          });
        });
        
        // Tampilkan semua produk tanpa filter untuk sementara
        console.log("Showing all products without filter for debugging");
        setProducts(produkData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal memuat produk. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [kategori, subkategori]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {subkategoriName}
            </h1>
            <p className="text-gray-600">
              Olahraga: {kategoriName}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat produk...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Kembali
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FiShoppingCart size={64} className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Belum Ada Produk
              </h2>
              <p className="text-gray-600 mb-4">
                Saat ini belum ada produk tersedia untuk kategori ini.
              </p>
              <div className="text-sm text-gray-500 mb-6">
                Kategori: {kategoriName} | Subkategori: {subkategoriName}
              </div>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Lihat Kategori Lain
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="block w-full bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center">
                      {product.gambar && product.gambar.length > 0 ? (
                        <Image
                          src={product.gambar[0]}
                          alt={product.nama}
                          width={160}
                          height={160}
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <FiShoppingCart size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-1.5">
                      <h3 className="text-xs font-medium text-gray-800 line-clamp-2 h-[32px]">
                        {product.nama}
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-orange-500">
                        {formatRupiah(product.harga)}
                      </p>
                      <div className="mt-0.5 flex items-center text-[11px] text-gray-600">
                        <FiStar className="text-yellow-400 mr-1 fill-yellow-400" size={12} />
                        <span>4.6</span>
                        <span className="mx-1">•</span>
                        <span>Terjual 100+</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
