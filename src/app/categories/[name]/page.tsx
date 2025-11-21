"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { getProdukByKategori } from "@/components/lib/services/produk.service";
import { getAverageRatingPublic } from "@/components/lib/services/rating.service";

type CategoryPageProps = {
  params: { name: string };
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const { name } = React.use(params);
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categoryName = decodeURIComponent(name).toLowerCase();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real implementation, you'd need to get the category ID by name
        // For this example, I'll use categoryId directly since it seems to be a string ID
        // The API might need to be expanded to support category name lookup
        const kategoriId = categoryName; // Assuming the name is the ID for now
        
        const data = await getProdukByKategori(kategoriId);
        
        // Fetch ratings for each product
        const productsWithRatings = await Promise.all(
          data.map(async (product) => {
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
        setError(err instanceof Error ? err.message : "Gagal memuat produk kategori");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <p className="text-lg">Memuat produk kategori...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <div>
          <h1 className="text-xl">Error memuat produk.</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <h1 className="text-xl">Tidak ada produk dalam kategori {name}.</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Produk dalam Kategori: {name}
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const imageUrl = (product.gambar && product.gambar.length > 0) ? product.gambar[0] : "/products/kao.jpeg";
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="rounded-lg bg-white p-4 shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col items-center">
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded">
                    <Image
                      src={imageUrl}
                      alt={product.nama}
                      width={300}
                      height={300}
                      className="object-contain max-h-40"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mt-4 text-center">{product.nama}</h2>
                  <p className="mt-2 text-orange-600 font-bold">{formatRupiah(product.harga)}</p>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <FiStar className="text-yellow-400 mr-1 fill-yellow-400" size={14} />
                    <span>
                      {product.averageRating && product.averageRating > 0 
                        ? product.averageRating.toFixed(1) 
                        : "Belum ada rating"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}