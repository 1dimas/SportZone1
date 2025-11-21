"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiFilter, FiStar } from "react-icons/fi";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service";
import { getSubkategoriPeralatanByKategoriOlahraga } from "@/components/lib/services/subkategori-peralatan.service";
import { getProdukByKategori } from "@/components/lib/services/produk.service";
import { getAverageRatingPublic } from "@/components/lib/services/rating.service";

type Params = {
  kategori: string;
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
  averageRating?: number;
};

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export default function KategoriPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = React.use(params);
  const { kategori } = resolvedParams;
  const router = useRouter();

  const [subkategories, setSubkategories] = useState<SubkategoriPeralatan[]>([]);
  const [products, setProducts] = useState<Produk[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Produk[]>([]);
  const [productsWithRatings, setProductsWithRatings] = useState<Produk[]>([]);
  const [selectedSubkategori, setSelectedSubkategori] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kategoriName, setKategoriName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const kategoriData = (await getAllKategoriOlahraga()) as KategoriOlahraga[];
        const foundKategori = kategoriData.find(
          (k) => k.nama.toLowerCase() === decodeURIComponent(kategori).toLowerCase()
        );

        if (!foundKategori) {
          setError("Kategori tidak ditemukan");
          setIsLoading(false);
          return;
        }

        setKategoriName(foundKategori.nama);

        // Fetch subkategories
        const subkategoriData = (await getSubkategoriPeralatanByKategoriOlahraga(
          foundKategori.id
        )) as SubkategoriPeralatan[];
        setSubkategories(subkategoriData);

        // Fetch all products from this kategori
        const produkData = (await getProdukByKategori(foundKategori.id)) as Produk[];
        setProducts(produkData);
        setFilteredProducts(produkData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [kategori]);

  // Fetch ratings for products and update the state
  useEffect(() => {
    const fetchProductRatings = async () => {
      if (products.length > 0) {
        const productsWithRatings = await Promise.all(
          products.map(async (product) => {
            try {
              const rating = await getAverageRatingPublic(product.id);
              return { ...product, averageRating: rating };
            } catch (error) {
              console.error(`Error fetching rating for product ${product.id}:`, error);
              return { ...product, averageRating: 0 };
            }
          })
        );
        setProductsWithRatings(productsWithRatings);
        
        // Update filtered products as well
        if (selectedSubkategori === null) {
          setFilteredProducts(productsWithRatings);
        } else {
          const filtered = productsWithRatings.filter((p) => p.subkategori_id === selectedSubkategori);
          setFilteredProducts(filtered);
        }
      }
    };

    fetchProductRatings();
  }, [products]);

  // Update filtered products when selected subkategori changes
  useEffect(() => {
    if (selectedSubkategori === null) {
      setFilteredProducts(productsWithRatings);
    } else {
      const filtered = productsWithRatings.filter((p) => p.subkategori_id === selectedSubkategori);
      setFilteredProducts(filtered);
    }
  }, [selectedSubkategori, productsWithRatings]);

  const handleFilterChange = (subkategoriId: string | null) => {
    setSelectedSubkategori(subkategoriId);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">
              {kategoriName}
            </h1>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data...</p>
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

          {/* Content: Filter & Products */}
          {!isLoading && !error && (
            <div className="flex flex-col gap-6">
              {/* Filter Buttons - Horizontal */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FiFilter className="text-orange-600" />
                  <h3 className="font-semibold text-lg">Filter Produk</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleFilterChange(null)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedSubkategori === null
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Semua Produk
                    <span className="ml-2 text-sm">({productsWithRatings.length})</span>
                  </button>

                  {subkategories.map((subkategori) => {
                    const count = productsWithRatings.filter((p) => p.subkategori_id === subkategori.id).length;
                    return (
                      <button
                        key={subkategori.id}
                        onClick={() => handleFilterChange(subkategori.id)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          selectedSubkategori === subkategori.id
                            ? "bg-orange-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {subkategori.nama}
                        <span className="ml-2 text-sm">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products Grid */}
              <div>
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <FiShoppingCart size={64} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Tidak Ada Produk
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Tidak ada produk tersedia untuk filter ini.
                    </p>
                    <button
                      onClick={() => handleFilterChange(null)}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Lihat Semua Produk
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8">
                    {filteredProducts.map((product) => (
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
                            <span>
                              {product.averageRating && product.averageRating > 0 
                                ? product.averageRating.toFixed(1) 
                                : "Belum ada rating"}
                            </span>
                            <span className="mx-1">•</span>
                            <span>Terjual 100+</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}