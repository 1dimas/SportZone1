"use client";

import Image from "next/image";
import Link from "next/link";
import { getAllProduk, getTotalSoldByProduct } from "@/components/lib/services/produk.service";
import { getAverageRatingPublic } from "@/components/lib/services/rating.service";
import Header from "@/components/Home/Header";
import { FiStar } from "react-icons/fi";
import { formatRupiah } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function SearchPage({ searchParams }: any) {
  const q = (searchParams.q || "").toLowerCase();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productRatings, setProductRatings] = useState<Record<string, number>>({});
  const [productSoldCounts, setProductSoldCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProduk();
        const filteredProducts = allProducts.filter((item: any) =>
          item.nama.toLowerCase().includes(q)
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [q]);

  // Fetch ratings and total sold when products change
  useEffect(() => {
    const fetchRatingsAndSold = async () => {
      if (products.length > 0) {
        const ratings: Record<string, number> = {};
        const soldCounts: Record<string, number> = {};
        
        await Promise.all(
          products.map(async (product) => {
            try {
              const [rating, totalSold] = await Promise.all([
                getAverageRatingPublic(product.id),
                getTotalSoldByProduct(product.id),
              ]);
              ratings[product.id] = rating;
              soldCounts[product.id] = totalSold;
            } catch (error) {
              console.error(`Error fetching data for product ${product.id}:`, error);
              ratings[product.id] = 0;
              soldCounts[product.id] = 0;
            }
          })
        );
        
        setProductRatings(ratings);
        setProductSoldCounts(soldCounts);
      }
    };

    fetchRatingsAndSold();
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Title Area */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Hasil pencarian:{" "}
            <span className="text-orange-600">"{q}"</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Menampilkan{" "}
            <span className="font-semibold">{products.length}</span> produk ditemukan
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={
                    Array.isArray(product.gambar)
                      ? product.gambar[0]
                      : "/products/kao.jpeg"
                  }
                  fill
                  className="object-cover"
                  alt={product.nama}
                />

                {product.diskon && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {product.diskon}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-800 line-clamp-2 h-8">
                  {product.nama}
                </h3>

                <p className="text-sm font-bold text-orange-500 mt-1">
                  {formatRupiah(product.harga)}
                </p>

                {product.diskon && (
                  <p className="text-[10px] text-gray-400 line-through -mt-0.5">
                    {formatRupiah(product.harga / (1 - product.diskon / 100))}
                  </p>
                )}

                <div className="mt-0.5 flex items-center text-[11px] text-gray-600">
                  <FiStar className="text-yellow-400 mr-1 fill-yellow-400" size={12} />
                  <span>
                    {productRatings[product.id] !== undefined && productRatings[product.id] > 0 
                      ? productRatings[product.id].toFixed(1) 
                      : "Belum ada rating"}
                  </span>
                  {productSoldCounts[product.id] !== undefined && productSoldCounts[product.id] > 0 && (
                    <>
                      <span className="mx-1">•</span>
                      <span>Terjual {productSoldCounts[product.id] >= 1000 ? `${(productSoldCounts[product.id] / 1000).toFixed(1)}rb` : productSoldCounts[product.id]}+</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-12 text-center text-gray-500 text-lg">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}