"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { ProductActions } from "@/components/Detailpage/ProductActions";
import type { ProductVariant } from "@/app/data/products";
import { getProdukById } from "@/components/lib/services/produk.service";

// Define the type for API response product
type APIProduct = {
  id: string;
  nama: string;
  harga: number;
  gambar: string[];
  stok?: number;
  slug?: string;
  subkategori?: {
    nama: string;
    kategoriOlahraga: {
      nama: string;
    };
  };
  brand?: {
    nama: string;
  };
  status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  variants: {
    id: string;
    ukuran?: string;
    warna?: string;
    stok: number;
    harga?: number;
    sku?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
  }[];
};

type UnionProduct = APIProduct;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<UnionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from API by ID only
        const apiProduct = await getProdukById(id);
        if (apiProduct) {
          setProduct(apiProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (variant: ProductVariant, quantity: number) => {
    // Add to cart logic here
    console.log("Adding to cart:", { variant, quantity });
    alert(`Added ${quantity} ${variant.color || variant.size} to cart`);
  };

  const handleOrderNow = (variant: ProductVariant, quantity: number) => {
    // Order now logic - redirect to checkout
    console.log("Ordering now:", { variant, quantity });
    // You can implement navigation to checkout page here
    router.push("/checkout");
  };

  // Helper functions to handle API product data
  const getName = (product: UnionProduct) => product.nama;

  const getPrice = (product: UnionProduct) => product.harga;

  const getImageUrls = (product: UnionProduct) => product.gambar;

  const getCategory = (product: UnionProduct) => {
    if (product.subkategori?.kategoriOlahraga) {
      return product.subkategori.kategoriOlahraga.nama;
    }
    return "Unknown Category";
  };

  const getSubcategory = (product: UnionProduct) => {
    return product.subkategori?.nama || "Unknown Subcategory";
  };

  const getBrand = (product: UnionProduct) => {
    return product.brand?.nama || "SportZone";
  };

  const getDescription = (product: UnionProduct) => {
    return "Deskripsi produk tidak tersedia"; // API doesn't provide description
  };

  const getProductId = (product: UnionProduct) => product.id.toString();

  const getVariants = (product: UnionProduct): ProductVariant[] => {
    if (product.variants && Array.isArray(product.variants)) {
      return product.variants.map((v) => ({
        size: v.ukuran || undefined,
        color: v.warna || undefined,
        stock: v.stok,
      }));
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200">
              <Image
                src={getImageUrls(product)[0]}
                alt={getName(product)}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              {/* Overlay gradient for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Thumbnail images if multiple images exist */}
            {getImageUrls(product).length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {getImageUrls(product).map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-slate-900 transition-colors cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${getName(product)} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-50 hover:border-red-200 border border-gray-200 group">
                <FiHeart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-red-600">
                  Favorite
                </span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 group">
                <FiShare2 className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium text-gray-700 group-hover:text-blue-600">
                  Share
                </span>
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {getName(product)}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {getCategory(product)}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {getSubcategory(product)}
                    </span>
                    {getBrand(product) !== "SportZone" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {getBrand(product)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <p className="text-5xl font-bold text-slate-900">
                  Rp {getPrice(product).toLocaleString("id-ID")}
                </p>
                <span className="text-lg text-gray-500 line-through">
                  Rp {(getPrice(product) * 1.2).toLocaleString("id-ID")}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Save 17%
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">{getDescription(product)}</p>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">✓</div>
                    <div className="text-sm text-gray-600">
                      Original Product
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">🚚</div>
                    <div className="text-sm text-gray-600">Free Shipping</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <ProductActions
                product={{
                  variants: getVariants(product),
                  name: getName(product),
                  price: getPrice(product),
                  image: getImageUrls(product)[0],
                  id: getProductId(product),
                  stock: product.stok,
                }}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
              />
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-r from-slate-50 to-orange-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Why Choose SportZone?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    100% Authentic Products
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">🚚</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Free Shipping Nationwide
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">↩</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    30-Day Return Policy
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">🛡️</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Warranty Included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
