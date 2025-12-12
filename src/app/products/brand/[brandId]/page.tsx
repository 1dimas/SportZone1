"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiStar, FiShoppingCart } from "react-icons/fi";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import { getProdukByBrand } from "@/components/lib/services/produk.service";
import { getBrandById } from "@/components/lib/services/brand.service";
import { getAverageRatingPublic } from "@/components/lib/services/rating.service";

type BrandPageProps = {
  params: Promise<{ brandId: string }>;
};

type Brand = {
  id: string;
  nama: string;
  deskripsi?: string;
  logo?: string;
};

type APIProduct = {
  id: string;
  nama: string;
  harga: number;
  gambar: string[];
  slug?: string;
  category?: string;
  subcategory?: string;
  brand?: { nama: string };
  isNew?: boolean;
  description?: string;
  variants: {
    size?: string | number;
    color?: string;
    stok: number;
  }[];
  averageRating?: number;
  totalSold?: number;
};

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export default function BrandProductsPage({ params }: BrandPageProps) {
  const resolvedParams = React.use(params);
  const { brandId } = resolvedParams;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [brandData, productsData] = await Promise.all([
          getBrandById(brandId),
          getProdukByBrand(brandId),
        ]);

        setBrand(brandData);
        
        const productsArray = Array.isArray(productsData) ? productsData : [productsData];
        
        const productsWithRatings = await Promise.all(
          productsArray.map(async (product) => {
            try {
              const rating = await getAverageRatingPublic(product.id);
              return { ...product, averageRating: rating };
            } catch (error) {
              console.error(`Error fetching rating for product ${product.id}:`, error);
              return { ...product, averageRating: 0 };
            }
          })
        );

        setProducts(productsWithRatings);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchData();
    }
  }, [brandId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat produk...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 text-xl">{error}</p>
              <Link href="/home" className="mt-4 inline-block text-orange-500 hover:underline">
                Kembali ke Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {brand?.logo && (
              <div className="w-20 h-20 relative">
                <Image
                  src={brand.logo}
                  alt={brand.nama}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{brand?.nama}</h1>
              {brand?.deskripsi && (
                <p className="text-gray-600 mt-2">{brand.deskripsi}</p>
              )}
            </div>
          </div>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? "produk" : "produk"}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stok, 0);
              const imageUrl = product.gambar?.[0] || "/placeholder-product.jpg";

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug || product.id}`}
                  className="group"
                >
                  <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={product.nama}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isNew && (
                        <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          Baru
                        </span>
                      )}
                      {totalStock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">Stok Habis</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                        {product.nama}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                        <span className="text-sm text-gray-600">
                          {product.averageRating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                      
                      <p className="text-orange-500 font-bold text-base">
                        {formatRupiah(product.harga)}
                      </p>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        Stok: {totalStock}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada produk untuk brand ini.
            </p>
            <Link href="/home" className="mt-4 inline-block text-orange-500 hover:underline">
              Kembali ke Home
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
