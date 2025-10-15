// BAGIAN 0: WAJIB ADA UNTUK INTERAKTIVITAS
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import products from "@/app/data/products";
import { getProdukById } from "@/components/lib/services/produk.service";
import type { Product, ProductVariant } from "@/app/data/products";
import Header from "@/components/Detailpage/header";
import Footer from "@/components/Detailpage/Footer";
import { ProductImageGallery } from "@/components/Detailpage/ProductImageGallery";
import { ProductActions } from "@/components/Detailpage/ProductActions";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";

// Define the type for API response product
type APIProduct = {
  id: string;
  nama: string;
  harga: number;
  gambar: string[];
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

type UnionProduct = APIProduct | Product;

type ProductPageProps = {
  params: { slug: string };
};

// BAGIAN 1: KOMPONEN HALAMAN UTAMA
export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  // --- State untuk menyimpan produk dan loading status ---
  const [product, setProduct] = useState<UnionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Ambil slug produk dari URL ---
  const productSlug = decodeURIComponent(slug).toLowerCase();

  // --- State untuk menyimpan ukuran yang dipilih ---
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();

  const { dispatch } = useCart();
  const router = useRouter();

  // Determine if product should be fetched from API or local data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to find product in local data
        const localProduct: Product | undefined = products.find(
          (p: Product) => p.slug.toLowerCase() === productSlug
        );

        if (localProduct) {
          // Use local product data
          setProduct(localProduct);
          // Set first available variant as selected
          if (localProduct.variants && localProduct.variants.length > 0) {
            const availableVariant = localProduct.variants.find((v: ProductVariant) => v.stock > 0) || localProduct.variants[0];
            setSelectedVariant(availableVariant);
          }
        } else {
          // If not found in local data, try API
          try {
            const apiProduct = await getProdukById(productSlug);
            setProduct(apiProduct);

            // Set first available variant as selected
            if (apiProduct.variants && apiProduct.variants.length > 0) {
              const availableVariant = apiProduct.variants.find((v: ProductVariant) => v.stock > 0) || apiProduct.variants[0];
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
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex h-screen items-center justify-center text-center text-red-600">
          <div>
            <h1>Produk dengan slug {decodeURIComponent(slug)} tidak ditemukan.</h1>
            {error && <p className="mt-2 text-sm">{error}</p>}
          </div>
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
    if ('category' in product && typeof product.category === 'string') return product.category || 'N/A';
    if ('subkategori' in product && product.subkategori?.kategoriOlahraga?.nama) return product.subkategori.kategoriOlahraga.nama || 'N/A';
    return 'N/A';
  };

  const getDescription = (product: UnionProduct): string => {
    if ('description' in product && typeof product.description === 'string') return product.description || 'Tidak ada deskripsi';
    if ('deskripsi' in product && typeof product.deskripsi === 'string') return product.deskripsi || 'Tidak ada deskripsi';
    return 'Tidak ada deskripsi';
  };

  const getImageUrls = (product: UnionProduct): string[] => {
    if ('imageUrl' in product) return [product.imageUrl];
    if ('gambar' in product && Array.isArray(product.gambar) && product.gambar.length > 0) return product.gambar;
    return ["/products/kao.jpeg"];
  };

  const getVariants = (product: UnionProduct): ProductVariant[] => {
    if ('variants' in product && Array.isArray(product.variants)) {
      if (product.variants.length > 0 && 'size' in product.variants[0]) {
        // Local product variants
        return product.variants as ProductVariant[];
      } else if (product.variants.length > 0 && 'ukuran' in (product.variants[0] as any)) {
        // API product variants - convert to ProductVariant format
        return (product.variants as any[]).map(v => ({
          size: v.ukuran || v.warna || 'One Size',
          stock: v.stok
        }));
      }
    }
    return [];
  };

  const getProductId = (product: UnionProduct): string => {
    if ('id' in product && product.id !== undefined) return product.id.toString();
    if ('_id' in product && product._id !== undefined && product._id !== null) return product._id.toString();
    return '';
  };

  const handleAddToCart = (variant: ProductVariant, qty: number) => {
    const cartItem = {
      productId: getProductId(product),
      name: getName(product),
      price: getPrice(product),
      image: getImageUrls(product)[0],
      size: variant.size?.toString() || '',
      quantity: qty,
      stock: variant.stock
    };

    dispatch({ type: 'ADD_TO_CART', payload: { item: cartItem } });
    alert('Produk berhasil ditambahkan ke keranjang!');
  };

  // Helper to get brand name
  const getBrand = (product: UnionProduct): string => {
    if ('brand' in product && product.brand?.nama) return product.brand.nama;
    return 'N/A';
  };

  // Helper to get subcategory name
  const getSubcategory = (product: UnionProduct): string => {
    if ('subcategory' in product && typeof product.subcategory === 'string') return product.subcategory;
    if ('subkategori' in product && product.subkategori?.nama) return product.subkategori.nama;
    return 'N/A';
  };

  // BAGIAN 2: TAMPILAN UI
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 rounded-lg bg-white p-6 shadow-md md:grid-cols-2 md:p-8 lg:gap-16">
          {/* Kolom Gambar Produk */}
          <div className="flex items-center justify-center">
            <ProductImageGallery images={getImageUrls(product)} />
          </div>

          {/* Kolom Detail & Aksi */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              {getName(product)}
            </h1>
            <p className="mt-2 text-sm font-medium text-indigo-600">
              Kategori: {getCategory(product)} | Subkategori: {getSubcategory(product)} | Brand: {getBrand(product)}
            </p>
            <div className="mt-4">
              <p className="text-3xl text-gray-800">{formatRupiah(getPrice(product))}</p>
            </div>

            {/* Deskripsi */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800">Deskripsi</h3>
              <p className="mt-2 text-base text-gray-600">{getDescription(product)}</p>
            </div>

            {/* Product Actions */}
            <div className="mt-8">
              <ProductActions
                product={{
                  variants: getVariants(product),
                  name: getName(product),
                  price: getPrice(product),
                  image: getImageUrls(product)[0],
                  id: getProductId(product)
                }}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* Tombol Lihat Keranjang */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Lihat Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer variant="simple" />
    </div>
  );
}
