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
import Header from "@/components/Home/Header";

type APIProduct = {
  id: string;
  nama: string;
  deskripsi?: string;
  harga: number;
  gambar: string[];
  stok?: number;
  slug?: string;
  rating?: number;
  averageRating?: number;
  totalSold?: number;
  subkategori?: {
    nama: string;
    kategoriOlahraga: { nama: string };
  };
  brand?: { nama: string };
  variants: {
    id: string;
    ukuran?: string;
    warna?: string;
    stok: number;
  }[];
};

type UnionProduct = APIProduct;
type ProductVariant = { size?: string; color?: string; stock: number };

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
    const load = async () => {
      try {
        setLoading(true);

        const [produkData, allProduk] = await Promise.all([
          getProdukById(id),
          getAllProduk(),
        ]);

        setProduct(produkData);

        const filtered = allProduk.filter((p) => p.id !== id).slice(0, 8);
        const relatedWithStats = await Promise.all(
          filtered.map(async (item) => {
            try {
              const [rating, sold] = await Promise.all([
                getAverageRatingPublic(item.id),
                getTotalSoldByProduct(item.id),
              ]);
              return { ...item, averageRating: rating, totalSold: sold };
            } catch {
              return { ...item, averageRating: 0, totalSold: 0 };
            }
          })
        );

        setRelated(relatedWithStats);

        const [ratingList, avgRating] = await Promise.all([
          getRatingsByProduct(id),
          getAverageRating(id),
        ]);

        setRatings(ratingList);
        setAverageRating(avgRating);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const getVariants = (product: UnionProduct): ProductVariant[] => {
    if (Array.isArray(product.variants)) {
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
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin h-24 w-24 rounded-full border-b-4 border-orange-500" />
        </div>
        <Footer />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Produk tidak ditemukan</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <Image
                src={product.gambar[selectedImageIndex]}
                alt={product.nama}
                fill
                className="object-contain p-4 transition-transform duration-500 hover:scale-105"
              />
            </div>

            {product.gambar.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.gambar.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 bg-white rounded-lg border flex-shrink-0 overflow-hidden transition-all
                      ${
                        selectedImageIndex === idx
                          ? "border-orange-500 shadow-sm"
                          : "border-gray-200 hover:border-orange-400"
                      }`}
                  >
                    <Image src={img} alt={product.nama} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.nama}</h1>
              <div className="flex items-center gap-2 mt-2">
                <FiStar className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="text-lg font-semibold text-gray-800">
                  {averageRating > 0 ? averageRating.toFixed(1) : "Belum ada rating"}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{ratings.length} ulasan</span>
              </div>
              <p className="text-3xl font-bold text-orange-600 mt-4">
                {formatRupiah(product.harga)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
              <h3 className="font-semibold text-gray-800">Informasi Produk</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {product.brand && (
                  <div>
                    <p className="text-gray-500">Brand</p>
                    <p className="font-medium text-gray-800">{product.brand.nama}</p>
                  </div>
                )}
                {product.subkategori && (
                  <div>
                    <p className="text-gray-500">Kategori</p>
                    <p className="font-medium text-gray-800">
                      {product.subkategori.kategoriOlahraga.nama} • {product.subkategori.nama}
                    </p>
                  </div>
                )}
                {typeof product.stok === "number" && (
                  <div>
                    <p className="text-gray-500">Stok</p>
                    <p className="font-medium text-gray-800">
                      {product.stok > 0 ? `${product.stok} unit` : "Habis"}
                    </p>
                  </div>
                )}
                {product.totalSold && (
                  <div>
                    <p className="text-gray-500">Terjual</p>
                    <p className="font-medium text-gray-800">{product.totalSold}+</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.deskripsi || "Deskripsi belum tersedia."}
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

        <RatingList ratings={ratings} averageRating={averageRating} />

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Lainnya</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {related.map((item) => {
              const rating = item.averageRating ?? item.rating ?? 0;
              const sold = item.totalSold ?? 0;

              return (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-square bg-white">
                    <Image
                      src={item.gambar[0]}
                      alt={item.nama}
                      fill
                      className="object-contain p-3"
                    />
                  </div>

                  <div className="p-3 space-y-1.5">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {item.nama}
                    </p>
                    <p className="text-orange-600 font-semibold text-sm">
                      {formatRupiah(item.harga)}
                    </p>

                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span>{rating > 0 ? rating.toFixed(1) : "Belum ada"}</span>
                      {sold > 0 && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>Terjual {sold}+</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
