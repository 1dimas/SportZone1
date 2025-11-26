"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { ProductActions } from "@/components/Detailpage/ProductActions";
import { formatRupiah } from "@/lib/utils";
import { RatingList } from "@/components/Detailpage/RatingList";
import {
  getProdukById,
  getAllProduk,
  getTotalSoldByProduct,
} from "@/components/lib/services/produk.service";
import {
  getRatingsByProduct,
  getAverageRating,
  getAverageRatingPublic,
  type RatingData,
} from "@/components/lib/services/rating.service";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header"; // <-- Import ini sudah ada

type APIProduct = {
  id: string;
  nama: string;
  harga: number;
  gambar: string[];
  stok?: number;
  slug?: string;
  rating?: number;
  averageRating?: number;
  totalSold?: number;
  subkategori?: {
    nama: string;
    kategoriOlahraga: {
      nama: string;
    };
  };
  brand?: {
    nama: string;
  };
  variants: {
    id: string;
    ukuran?: string;
    warna?: string;
    stok: number;
  }[];
};

type UnionProduct = APIProduct;

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<UnionProduct | null>(null);
  const [related, setRelated] = useState<UnionProduct[]>([]);
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [produkData, allProduk] = await Promise.all([
          getProdukById(id),
          getAllProduk(),
        ]);
        setProduct(produkData);
        const filtered = allProduk.filter((p) => p.id !== id);
        const relatedProducts = filtered.slice(0, 8);

        // Fetch rating dan total sold untuk produk lainnya secara paralel
        const relatedWithRatingsAndSold = await Promise.all(
          relatedProducts.map(async (product) => {
            try {
              const [rating, totalSold] = await Promise.all([
                getAverageRatingPublic(product.id),
                getTotalSoldByProduct(product.id),
              ]);
              return { ...product, averageRating: rating, totalSold };
            } catch (error) {
              return { ...product, averageRating: 0, totalSold: 0 };
            }
          })
        );
        setRelated(relatedWithRatingsAndSold);

        try {
          const [ratingsData, avgRating] = await Promise.all([
            getRatingsByProduct(id),
            getAverageRating(id),
          ]);
          setRatings(ratingsData);
          setAverageRating(avgRating);
        } catch (ratingErr) {
          console.error("Error loading ratings:", ratingErr);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  

  const getVariants = (product: UnionProduct): ProductVariant[] => {
    if (product.variants && Array.isArray(product.variants)) {
      return product.variants.map((v) => ({
        size: v.ukuran,
        color: v.warna,
        stock: v.stok,
      }));
    }
    return [];
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col">
        <Header /> {/* <-- Header saat loading */}
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-orange-500"></div>
        </div>
        <div className="mt-auto border-t border-gray-200 bg-orange-50 py-10">
          <Footer />
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col">
        <Header /> {/* <-- Header saat error */}
        <div className="flex-grow flex items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Produk tidak ditemukan
            </h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <div className="mt-auto border-t border-gray-200 bg-orange-50 py-10">
          <Footer />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header /> {/* <-- HEADER DITAMBAHKAN DI SINI */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tombol Kembali DIHAPUS DARI SINI */}

        {/* Detail Produk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Gambar Produk */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden border border-gray-200">
              <Image
                src={product.gambar[selectedImageIndex]}
                alt={product.nama}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {product.gambar.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.gambar.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:border-orange-500 transition ${
                      selectedImageIndex === idx ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.nama}-${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Produk */}
          <div className="space-y-4 lg:space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.nama}
            </h1>
            <div className="flex items-center">
              <FiStar className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                {averageRating > 0 ? averageRating.toFixed(1) : "Belum ada rating"}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-600">
                {ratings.length} ulasan
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-semibold text-orange-600">
              {formatRupiah(product.harga)}
            </p>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
              <p className="text-gray-600 text-sm">
                Deskripsi produk belum tersedia.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <ProductActions
                product={{
                  variants: getVariants(product),
                  name: product.nama,
                  price: product.harga,
                  image: product.gambar[0],
                  id: product.id,
                  stock: product.stok,
                }}
              />
            </div>
          </div>
        </div>

        {/* Rating & Ulasan Section */}
        <div className="mb-16">
          <RatingList ratings={ratings} averageRating={averageRating} />
        </div>

        
        {/* Produk Lainnya */}
<div>
  <h2 className="text-2xl font-bold text-gray-900 mb-6">
    Produk Lainnya
  </h2>

  {related.length === 0 ? (
    <p className="text-gray-600">Tidak ada produk lain.</p>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
      {related.map((item) => {
        // Gunakan averageRating dari API jika ada, fallback ke rating atau 0
        const rating = item.averageRating ?? item.rating ?? 0;
        
        // Gunakan totalSold dari API jika ada
        const sold = item.totalSold ?? 0;

        return (
          <Link
            key={item.id}
            href={`/product/${item.id}`}
            className="
              bg-white border border-gray-200 rounded-xl overflow-hidden
              shadow-sm hover:shadow-md transition duration-300
              hover:-translate-y-1
            "
          >
            {/* Gambar */}
            <div className="relative w-full aspect-square bg-gray-50">
              <Image
                src={item.gambar[0]}
                alt={item.nama}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Detail Produk */}
            <div className="p-3 space-y-1.5">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                {item.nama}
              </h3>

              <p className="text-orange-600 font-semibold text-sm">
                {formatRupiah(item.harga)}
              </p>

              {/* ⭐ Rating + Terjual */}
              <div className="flex items-center gap-1 text-[11px] text-gray-600">
                <span className="text-yellow-400 text-xs">★</span>
                <span>{rating > 0 ? rating.toFixed(1) : "Belum ada rating"}</span>
                {sold > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>Terjual {sold >= 1000 ? `${(sold / 1000).toFixed(1)}rb` : sold}+</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )}
</div>

      </main>
      {/* Footer */}
      <footer className="mt-20 border-t ...">
        <Footer />
      </footer>
    </div>
  );
}
