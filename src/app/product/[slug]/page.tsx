// BAGIAN 0: WAJIB ADA UNTUK INTERAKTIVITAS
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import products from "@/app/data/products";
import { getProdukById } from "@/components/lib/services/produk.service";
import type { Product, ProductVariant } from "@/app/data/products";

// Fungsi format Rupiah
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Define the type for API response product
type APIProduct = {
  id: string;           
  nama: string;         
  harga: number;        
  gambar: string[];     
  slug?: string;
  category?: string;
  subcategory?: string;
  isNew?: boolean;
  description?: string;
  variants: ProductVariant[];
};

type UnionProduct = APIProduct | Product;

type ProductPageProps = {
  params: { slug: string };
};

// BAGIAN 1: KOMPONEN HALAMAN UTAMA
export default function ProductPage({ params }: ProductPageProps) {
  // --- State untuk menyimpan produk dan loading status ---
  const [product, setProduct] = useState<UnionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Ambil slug produk dari URL ---
  const productSlug = decodeURIComponent(params.slug).toLowerCase();

  // --- State untuk menyimpan ukuran yang dipilih ---
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();

  // Determine if product should be fetched from API or local data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to find product in local data
        const localProduct: Product | undefined = products.find(
          (p) => p.slug.toLowerCase() === productSlug
        );

        if (localProduct) {
          // Use local product data
          setProduct(localProduct);
          // Set first available variant as selected
          if (localProduct.variants && localProduct.variants.length > 0) {
            const availableVariant = localProduct.variants.find(v => v.stock > 0) || localProduct.variants[0];
            setSelectedVariant(availableVariant);
          }
        } else {
          // If not found in local data, try API
          try {
            const apiProduct = await getProdukById(productSlug);
            setProduct(apiProduct);
            
            // Set first available variant as selected
            if (apiProduct.variants && apiProduct.variants.length > 0) {
              const availableVariant = apiProduct.variants.find(v => v.stock > 0) || apiProduct.variants[0];
              setSelectedVariant(availableVariant);
            }
          } catch (apiError) {
            setError("Gagal memuat produk dari API");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <div>
          <h1>Produk dengan slug {params.slug} tidak ditemukan.</h1>
          {error && <p className="mt-2 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  // Helper functions to handle both product types
  const getName = (product: UnionProduct): string => {
    if ('name' in product) return product.name;
    if ('nama' in product) return product.nama;
    return 'Tidak Diketahui';
  };

  const getPrice = (product: UnionProduct): number => {
    if ('price' in product) return product.price;
    if ('harga' in product) return product.harga;
    return 0;
  };

  const getCategory = (product: UnionProduct): string => {
    if ('category' in product) return product.category || 'N/A';
    if ('kategori' in product) return product.kategori || 'N/A';
    return 'N/A';
  };

  const getDescription = (product: UnionProduct): string => {
    if ('description' in product) return product.description || 'Tidak ada deskripsi';
    if ('deskripsi' in product) return product.deskripsi || 'Tidak ada deskripsi';
    return 'Tidak ada deskripsi';
  };

  const getImageUrl = (product: UnionProduct): string => {
    if ('imageUrl' in product) return product.imageUrl;
    if ('gambar' in product && Array.isArray(product.gambar) && product.gambar.length > 0) return product.gambar[0];
    return "/products/kao.jpeg";
  };

  const getVariants = (product: UnionProduct): ProductVariant[] => {
    if ('variants' in product && Array.isArray(product.variants)) return product.variants;
    return [];
  };

  // BAGIAN 2: TAMPILAN UI
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 rounded-lg bg-white p-6 shadow-md md:grid-cols-2 md:p-8 lg:gap-16">
          {/* Kolom Gambar Produk */}
          <div className="flex items-center justify-center">
            <Image
              src={getImageUrl(product)}
              alt={getName(product)}
              width={600}
              height={600}
              className="h-auto w-full max-w-md rounded-lg object-contain"
              priority
            />
          </div>

          {/* Kolom Detail & Aksi */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              {getName(product)}
            </h1>
            <p className="mt-2 text-sm font-medium text-indigo-600">
              Kategori: {getCategory(product)}
            </p>
            <div className="mt-4">
              <p className="text-3xl text-gray-800">{formatRupiah(getPrice(product))}</p>
            </div>

            {/* Pilih Ukuran */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-800">Pilih Ukuran:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {getVariants(product).map((variant) => (
                  <button
                    key={variant.size?.toString()}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors 
                      ${
                        variant.stock === 0
                          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                          : ""
                      }
                      ${
                        selectedVariant?.size === variant.size
                          ? "border-transparent bg-indigo-600 text-white ring-2 ring-indigo-500"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800">Deskripsi</h3>
              <p className="mt-2 text-base text-gray-600">{getDescription(product)}</p>
            </div>

            {/* Stok */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700">
                Stok Ukuran {selectedVariant?.size}:
                <span
                  className={
                    selectedVariant && selectedVariant.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {` ${selectedVariant?.stock || 0} Tersisa`}
                </span>
              </p>
            </div>

            {/* Tombol */}
            <div className="mt-8">
              <button
                type="button"
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}