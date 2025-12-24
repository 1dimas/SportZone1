"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { FiStar } from "react-icons/fi";
import { formatRupiah } from "@/lib/utils";

type ProductVariant = {
  size: string | number;
  stock: number;
};

type Product = {
  id: string | number;
  nama?: string;
  name?: string;
  harga?: number;
  price?: number;
  gambar?: string[];
  imageUrl?: string;
  slug?: string;
  isNew?: boolean;
  description?: string;
  variants?: ProductVariant[];
  rating?: number; // 0–5
  averageRating?: number; // Rating rata-rata dari API
  totalSold?: number; // Jumlah terjual
  _count?: {
    ratings?: number;
  };
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const name = product.nama || product.name || "";
  const price = product.harga ?? product.price ?? 0;
  const imageUrl =
    product.gambar?.[0] || product.imageUrl || "/products/kao.jpeg";
  const isExternal =
    imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  // Gunakan averageRating dari API jika ada, fallback ke rating atau 0
  const rating = product.averageRating ?? product.rating ?? 0;
  
  // Gunakan totalSold dari API jika ada
  const sold = product.totalSold ?? 0;
  
  // Jumlah review dari _count.ratings jika ada
  const reviewCount = product._count?.ratings ?? 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="
        block 
        w-full 
        bg-white 
        rounded-xl 
        border border-gray-100 
        shadow-sm
        overflow-hidden 
        hover:shadow-lg 
        hover:-translate-y-1 
        transition-all 
        duration-300
        group
      "
    >
      {/* Gambar Produk */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="
            transition-transform 
            duration-500 
            group-hover:scale-105
            object-contain 
          "
          unoptimized={isExternal}
        />

        {product.isNew && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg z-10">
            Baru
          </span>
        )}
      </div>

      {/* Info Produk */}
      <div className="p-3">
        <h3
          className="
            text-sm 
            font-medium 
            text-gray-800 
            line-clamp-2 
            min-h-[40px]
            leading-5
          "
        >
          {name}
        </h3>

        <p className="mt-2 text-base font-bold text-orange-500">
          {formatRupiah(price)}
        </p>

        <div className="mt-2 flex items-center text-xs text-gray-500">
          <FiStar className="text-yellow-400 mr-1 fill-yellow-400" size={14} />
          <span className="font-medium">{rating > 0 ? rating.toFixed(1) : "0"}</span>
          {sold > 0 && (
            <>
              <span className="mx-1.5 text-gray-300">•</span>
              <span>Terjual {sold >= 1000 ? `${(sold / 1000).toFixed(1)}rb` : sold}+</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;