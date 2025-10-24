// components/Detailpage/ProductActions.tsx
"use client";

import { useState, useEffect } from "react";
import type { ProductVariant } from "@/app/data/products";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { getVarianByProduk } from "@/components/lib/services/produk.service";
import { useCart } from "@/context/cart-context";

type ProductData = {
  variants: ProductVariant[];
  name: string;
  price: number;
  image: string;
  id: string;
  stock?: number;
};

type ProductActionsProps = {
  product: ProductData;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
  onOrderNow?: (variant: ProductVariant, quantity: number) => void;
};

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onAddToCart,
  onOrderNow,
}) => {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | number | undefined>(
    undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [apiVariants, setApiVariants] = useState<any[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Fetch variants from API
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoadingVariants(true);
        const variants = await getVarianByProduk(product.id);
        setApiVariants(variants);
      } catch (error) {
        console.error("Failed to fetch variants:", error);
        // Fallback to product.variants if API fails
        setApiVariants(product.variants);
      } finally {
        setLoadingVariants(false);
      }
    };

    if (product.id) {
      fetchVariants();
    }
  }, [product.id, product.variants]);

  // Use API variants if available, otherwise use product variants
  const variants = apiVariants.length > 0 ? apiVariants : product.variants;

  // Cek apakah produk punya ukuran dan/atau warna
  const hasSizes = variants.some(
    (v) => v.ukuran !== undefined || v.size !== undefined
  );
  const hasColors = variants.some(
    (v) => v.warna !== undefined || v.color !== undefined
  );

  // Jika produk tidak punya variant sama sekali, buat virtual variant dari produk utama
  const hasVariants = variants.length > 0 && (hasSizes || hasColors);

  const availableSizes = hasSizes
    ? [...new Set(variants.map((v) => v.ukuran || v.size).filter(Boolean))]
    : [];
  const availableColors = hasColors
    ? [...new Set(variants.map((v) => v.warna || v.color).filter(Boolean))]
    : [];

  // Jika tidak ada variant, buat virtual variant dari produk utama
  const virtualVariant = !hasVariants
    ? {
        id: `virtual-${product.id}`,
        ukuran: undefined,
        warna: undefined,
        stok: product.stock || 999, // Stok dari produk utama (akan dicek di backend)
        harga: product.price,
        size: undefined,
        color: undefined,
        stock: product.stock || 999,
      }
    : null;

  // Cari variant yang sesuai dengan selected size & color
  const selectedVariant = hasVariants
    ? variants.find(
        (v) =>
          (hasSizes ? (v.ukuran || v.size) === selectedSize : true) &&
          (hasColors ? (v.warna || v.color) === selectedColor : true)
      )
    : virtualVariant;

  // Set default variant saat load produk
  useEffect(() => {
    if (variants.length > 0 && !loadingVariants) {
      const firstVariant = variants[0];
      if (
        hasSizes &&
        (firstVariant.ukuran || firstVariant.size) !== undefined &&
        selectedSize === undefined
      ) {
        setSelectedSize(firstVariant.ukuran || firstVariant.size);
      }
      if (
        hasColors &&
        (firstVariant.warna || firstVariant.color) !== undefined &&
        selectedColor === undefined
      ) {
        setSelectedColor(firstVariant.warna || firstVariant.color);
      }
    }
  }, [
    variants,
    hasSizes,
    hasColors,
    selectedSize,
    selectedColor,
    loadingVariants,
  ]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Silakan pilih varian terlebih dahulu.");
      return;
    }
    if (quantity > selectedVariant.stok) {
      alert(`Stok tidak mencukupi. Maksimal ${selectedVariant.stok} buah`);
      return;
    }
    // Add to cart using context
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: {
          productId: product.id,
          name: product.name,
          price: selectedVariant.harga || product.price,
          image: product.image,
          size: selectedSize?.toString() || selectedColor || "Default",
          variantId: selectedVariant.id,
          quantity: quantity,
          stock: selectedVariant.stok,
        },
      },
    });
    alert(`Added ${quantity} ${selectedSize || selectedColor} to cart`);
  };

  const handleOrderNow = () => {
    if (!selectedVariant) {
      alert("Silakan pilih varian terlebih dahulu.");
      return;
    }
    if (quantity > selectedVariant.stok) {
      alert(`Stok tidak mencukupi. Maksimal ${selectedVariant.stok} buah`);
      return;
    }
    // Add to cart first, then redirect to checkout
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: {
          productId: product.id,
          name: product.name,
          price: selectedVariant.harga || product.price,
          image: product.image,
          size: selectedSize?.toString() || selectedColor || "Default",
          variantId: selectedVariant.id,
          quantity: quantity,
          stock: selectedVariant.stok,
        },
      },
    });
    if (onOrderNow) {
      onOrderNow(selectedVariant, quantity);
    }
  };

  // Check if a size has available variants
  const isSizeAvailable = (size: string | number) => {
    return variants.some((v) => (v.ukuran || v.size) === size && v.stok > 0);
  };

  // Check if a color has available variants
  const isColorAvailable = (color: string) => {
    return variants.some((v) => (v.warna || v.color) === color && v.stok > 0);
  };

  if (loadingVariants) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <span className="ml-2 text-sm text-gray-600">Memuat varian...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Pilihan Ukuran */}
      {hasSizes && (
        <div>
          <label className="block text-xs text-gray-500 mb-2">Ukuran:</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size, idx) => {
              const available = isSizeAvailable(size);
              const isSelected = selectedSize === size;
              return (
                <button
                  key={idx}
                  onClick={() => available && setSelectedSize(size)}
                  disabled={!available}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                    !available
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-orange-500 text-white border-orange-500 shadow-md"
                      : "bg-white hover:bg-orange-50 border-gray-300 hover:border-orange-300"
                  }`}
                >
                  {size}
                  {!available && <span className="ml-1 text-xs">(Kosong)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pilihan Warna */}
      {hasColors && (
        <div>
          <label className="block text-xs text-gray-500 mb-2">Warna:</label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color, idx) => {
              const available = isColorAvailable(color);
              const isSelected = selectedColor === color;
              return (
                <button
                  key={idx}
                  onClick={() => available && setSelectedColor(color)}
                  disabled={!available}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                    !available
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-orange-500 text-white border-orange-500 shadow-md"
                      : "bg-white hover:bg-orange-50 border-gray-300 hover:border-orange-300"
                  }`}
                >
                  {color}
                  {!available && <span className="ml-1 text-xs">(Kosong)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Informasi Variant yang Dipilih */}
      {selectedVariant && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Variant Dipilih:
          </h4>
          <div className="text-sm text-blue-800">
            {hasSizes && hasColors && (
              <p>
                Ukuran: {selectedSize} | Warna: {selectedColor}
              </p>
            )}
            {hasSizes && !hasColors && <p>Ukuran: {selectedSize}</p>}
            {hasColors && !hasSizes && <p>Warna: {selectedColor}</p>}
            <p className="mt-1">Stok tersedia: {selectedVariant.stok}</p>
            {selectedVariant.harga && (
              <p className="mt-1">
                Harga variant: Rp{" "}
                {selectedVariant.harga.toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Jumlah */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-2 border rounded"
        >
          <FiMinus />
        </button>
        <span className="px-3">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="p-2 border rounded"
        >
          <FiPlus />
        </button>
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stok === 0}
          className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
            !selectedVariant || selectedVariant.stok === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <FiShoppingCart className="w-5 h-5" />
          Tambah ke Keranjang
        </button>

        <button
          onClick={handleOrderNow}
          disabled={!selectedVariant || selectedVariant.stok === 0}
          className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition ${
            !selectedVariant || selectedVariant.stok === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};
