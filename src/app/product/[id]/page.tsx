"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiInfo } from "react-icons/fi";
import { ProductActions } from "@/components/Detailpage/ProductActions";
import { ProductDetailSkeleton } from "@/components/Detailpage/ProductDetailSkeleton";
import { formatRupiah } from "@/lib/utils";
import { RatingList } from "@/components/Detailpage/RatingList";
import { RatingForm } from "@/components/Detailpage/RatingForm";
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
import { getProfile } from "@/components/lib/services/auth.service";
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [displayPrice, setDisplayPrice] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        try {
          const profile = await getProfile();
          setCurrentUserId(profile.id);
        } catch {
          setCurrentUserId(null);
        }

        const [produkData, allProduk, totalSold] = await Promise.all([
          getProdukById(id),
          getAllProduk(),
          getTotalSoldByProduct(id),
        ]);

        setProduct({ ...produkData, totalSold });

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
        <ProductDetailSkeleton />
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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-orange-500">Beranda</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.nama}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">

          {/* KOLOM 1: Gambar (Sticky di Desktop) - 4 Kolom */}
          <div className="lg:col-span-4 h-fit lg:sticky lg:top-24 z-10">
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-zoom-in">
                <Image
                  src={product.gambar[selectedImageIndex]}
                  alt={product.nama}
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>

              {product.gambar.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.gambar.map((img, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setSelectedImageIndex(idx)}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImageIndex === idx
                        ? "border-orange-500 opacity-100"
                        : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`thumb-${idx}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KOLOM 2: Info Utama & Deskripsi - 5 Kolom */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {product.nama}
              </h1>

              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-900 font-semibold">{product.totalSold || 0}</span>
                  <span className="text-gray-500">Terjual</span>
                </div>
                <div className="w-[1px] h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-0.5">
                  <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                  <span className="text-gray-900 font-semibold">
                    {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-gray-400 text-xs">({ratings.length})</span>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {formatRupiah(displayPrice || product.harga)}
                </h2>
              </div>
            </div>

            <div className="h-[1px] bg-gray-200 w-full" />

            {/* Navigasi Tab */}
            <div>
              <div className="flex gap-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("detail")}
                  className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "detail"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                    }`}
                >
                  Detail
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "info"
                    ? "text-orange-600 border-orange-600"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                    }`}
                >
                  Info Penting
                </button>
              </div>

              {/* Konten Tab */}
              <div className="mt-6">
                {activeTab === "detail" ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><span className="text-gray-500 min-w-[100px] inline-block">Kondisi:</span> Baru</p>
                      <p><span className="text-gray-500 min-w-[100px] inline-block">Min. Pemesanan:</span> 1 Buah</p>
                      {product.subkategori && (
                        <p><span className="text-gray-500 min-w-[100px] inline-block">Kategori:</span>
                          <span className="text-orange-600 font-medium cursor-pointer"> {product.subkategori.nama}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <p className="font-semibold text-gray-900 mb-2 text-sm">Deskripsi produk</p>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {product.deskripsi || "Tidak ada deskripsi."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-2">
                      <FiInfo className="mt-0.5 text-orange-500" />
                      <div>
                        <p className="font-semibold text-gray-800 mb-1">Kebijakan Pengembalian</p>
                        <p>Harap sertakan foto barang rusak untuk klaim garansi atau retur barang.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bagian Ulasan */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ulasan Pembeli</h3>
              <RatingList ratings={ratings} averageRating={averageRating} />
            </div>
          </div>

          {/* KOLOM 3: Action Card (Sticky Kanan) - 3 Kolom */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-gray-900 mb-4 text-base">Atur jumlah dan catatan</h3>

              <div className="product-actions-sidebar">
                <ProductActions
                  product={{
                    variants: getVariants(product),
                    name: product.nama,
                    price: product.harga,
                    image: product.gambar[0],
                    id: product.id,
                    stock: product.stok,
                  }}
                  onPriceChange={(price) => setDisplayPrice(price)}
                />
              </div>
            </div>
          </div>

        </div>

        {/* RELATED PRODUCTS SECTION */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Pilihan Lainnya Untukmu</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
