"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { menuData } from "@/app/data/menuData";
import products from "@/app/data/products";

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };

  // Cari kategori berdasarkan slug
  const category = menuData.find((cat) => cat.slug === slug);

  if (!category) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        <h1>Kategori tidak ditemukan.</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{category.title}</h1>
        {/* Grid icon subkategori */}
        <div className="flex gap-6 overflow-x-auto mb-8">
          {category.columns.map((sub) => (
            <div
              key={sub.heading}
              className="flex flex-col items-center min-w-[100px]"
            >
              {/* Ganti src dengan gambar/icon sesuai subkategori jika ada */}
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow mb-2 overflow-hidden">
                <Image
                  src="/placeholder.png"
                  alt={sub.heading}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-center">{sub.heading}</span>
            </div>
          ))}
        </div>
        {/* Produk per subkategori */}
        {category.columns.map((sub) => {
          const filteredProducts = products.filter(
            (p) => p.category === category.title && p.subcategory === sub.heading
          );
          return (
            <div key={sub.heading} className="mb-10">
              <h2 className="text-xl font-bold mb-4">{sub.heading}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
                  >
                    <div className="relative w-full h-32">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-sm font-bold text-gray-900">
                        {formatRupiah(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-gray-400 text-center py-8">
                    Tidak ada produk di subkategori ini.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
