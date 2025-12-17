// components/Detailpage/ProductActions.tsx
"use client";

import { useState, useEffect } from "react";
import type { ProductVariant } from "@/app/data/products";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { getVarianByProduk } from "@/components/lib/services/produk.service";
import { useCart } from "@/context/cart-context";
import { addKeranjangItem } from "@/components/lib/services/keranjang.service";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

type ProductData = {
  variants: ProductVariant[];
  name: string;
  price: number;
  image: string;
  id: string;
  stock?: number;
};

type ApiVariant = {
  id: string;
  ukuran?: string;
  size?: string;
  warna?: string;
  color?: string;
  stok: number;
  stock: number;
  harga: number;
};

type ProductActionsProps = {
  product: ProductData;
};

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
}) => {
  const { dispatch } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string | number | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [apiVariants, setApiVariants] = useState<ApiVariant[]>([]);
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
        setApiVariants(product.variants);
      } finally {
        setLoadingVariants(false);
      }
    };

    if (product.id) fetchVariants();
  }, [product.id, product.variants]);

  const variants = apiVariants.length > 0 ? apiVariants : product.variants;

  const hasSizes = variants.some((v) => v.ukuran !== undefined || v.size !== undefined);
  const hasColors = variants.some((v) => v.warna !== undefined || v.color !== undefined);
  const hasVariants = variants.length > 0 && (hasSizes || hasColors);

  const availableSizes = hasSizes
    ? [...new Set(variants.map((v) => v.ukuran || v.size).filter(Boolean))]
    : [];
  const availableColors = hasColors
    ? [...new Set(variants.map((v) => v.warna || v.color).filter(Boolean))]
    : [];

  const virtualVariant = !hasVariants
    ? {
        id: `virtual-${product.id}`,
        ukuran: undefined,
        warna: undefined,
        stok: product.stock || 0,
        harga: product.price,
        size: undefined,
        color: undefined,
        stock: product.stock || 0,
      }
    : null;

  const selectedVariant = hasVariants
    ? variants.find(
        (v) =>
          (hasSizes ? (v.ukuran || v.size) === selectedSize : true) &&
          (hasColors ? (v.warna || v.color) === selectedColor : true)
      )
    : virtualVariant;

  useEffect(() => {
    if (variants.length > 0 && !loadingVariants) {
      const firstVariant = variants[0];
      if (hasSizes && selectedSize === undefined)
        setSelectedSize(firstVariant.ukuran || firstVariant.size);
      if (hasColors && selectedColor === undefined)
        setSelectedColor(firstVariant.warna || firstVariant.color);
    }
  }, [variants, hasSizes, hasColors, selectedSize, selectedColor, loadingVariants]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Silakan login terlebih dahulu untuk menambahkan ke keranjang.");
      router.push("/login");
      return;
    }

    if (!selectedVariant) {
      toast.warning("Silakan pilih varian terlebih dahulu.");
      return;
    }

    if (quantity > selectedVariant.stok) {
      toast.error(`Stok tidak mencukupi. Maksimal ${selectedVariant.stok} buah`);
      return;
    }

    let variantType: "size" | "color" | "default" = "default";
    if (hasSizes && selectedSize !== undefined) variantType = "size";
    else if (hasColors && selectedColor !== undefined) variantType = "color";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: {
          productId: product.id,
          name: product.name,
          price: selectedVariant.harga || product.price,
          image: product.image,
          size: selectedSize?.toString() || selectedColor || "Default",
          selectedSize: selectedSize?.toString(),
          selectedColor: selectedColor,
          variantType,
          variantId: selectedVariant.id,
          quantity,
          stock: selectedVariant.stok,
        },
      },
    });

    const varianIdToSend =
      typeof selectedVariant.id === "string" && selectedVariant.id.startsWith("virtual-")
        ? null
        : (selectedVariant.id as string | undefined);

    addKeranjangItem({
      produk_id: product.id,
      produk_varian_id: varianIdToSend ?? undefined,
      kuantitas: quantity,
    }).catch(() => {});
    toast.success(`Berhasil menambahkan ${quantity} item ke keranjang`);
  };

  const handleOrderNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Silakan login terlebih dahulu untuk melakukan pemesanan.");
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      toast.warning("Silakan pilih varian terlebih dahulu.");
      return;
    }
    if (quantity > selectedVariant.stok) {
      toast.error(`Stok tidak mencukupi. Maksimal ${selectedVariant.stok} buah`);
      return;
    }

    const variantIdStr =
      typeof selectedVariant.id === "string" && selectedVariant.id.startsWith("virtual-")
        ? undefined
        : (selectedVariant.id as string | undefined);

    const directItem = {
      id: `direct-${product.id}-${selectedSize || selectedColor || "default"}`,
      productId: product.id,
      name: product.name,
      price: selectedVariant.harga || product.price,
      image: product.image,
      size: selectedSize?.toString() || selectedColor || "Default",
      variantId: variantIdStr,
      quantity,
      stock: selectedVariant.stok,
    };
    try {
      localStorage.setItem("checkout_direct_items", JSON.stringify([directItem]));
    } catch {}
    router.push("/checkout?mode=direct");
  };

  const isSizeAvailable = (size: string | number) =>
    variants.some((v) => (v.ukuran || v.size) === size && v.stok > 0);

  const isColorAvailable = (color: string) =>
    variants.some((v) => (v.warna || v.color) === color && v.stok > 0);

  if (loadingVariants) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-sm text-gray-600">Memuat varian...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pilihan Ukuran */}
      {hasSizes && (
        <div>
          <label className="block text-xs text-gray-700 mb-2 font-medium">Ukuran:</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size, idx) => {
              const available = isSizeAvailable(size);
              const isSelected = selectedSize === size;
              return (
                <button
                  key={idx}
                  onClick={() => available && setSelectedSize(size)}
                  disabled={!available}
                  className={`px-3 py-1.5 border rounded-md text-xs font-medium transition ${
                    !available
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white hover:bg-orange-50 border-gray-300 hover:border-orange-300"
                  }`}
                >
                  {size}
                  {!available && <span className="ml-1 text-[10px]">(Kosong)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pilihan Warna */}
      {hasColors && (
        <div>
          <label className="block text-xs text-gray-700 mb-2 font-medium">Warna:</label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color, idx) => {
              const available = isColorAvailable(color);
              const isSelected = selectedColor === color;
              return (
                <button
                  key={idx}
                  onClick={() => available && setSelectedColor(color)}
                  disabled={!available}
                  className={`px-3 py-1.5 border rounded-md text-xs font-medium transition ${
                    !available
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : isSelected
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white hover:bg-orange-50 border-gray-300 hover:border-orange-300"
                  }`}
                >
                  {color}
                  {!available && <span className="ml-1 text-[10px]">(Kosong)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Informasi Variant yang Dipilih */}
      {selectedVariant && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <h4 className="text-xs font-medium text-orange-900 mb-1">Variant Dipilih:</h4>
          <div className="text-xs text-orange-800 space-y-0.5">
            {hasSizes && hasColors && (
              <p>
                Ukuran: {selectedSize} | Warna: {selectedColor}
              </p>
            )}
            {hasSizes && !hasColors && <p>Ukuran: {selectedSize}</p>}
            {hasColors && !hasSizes && <p>Warna: {selectedColor}</p>}
            <p>Stok tersedia: {selectedVariant.stok}</p>
            {selectedVariant.harga && (
              <p>
                Harga variant: {formatRupiah(selectedVariant.harga)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Jumlah */}
      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          <FiMinus size={14} />
        </button>
        <span className="min-w-[40px] text-center font-medium text-sm">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          <FiPlus size={14} />
        </button>
      </div>

      {/* Tombol Aksi - Always Stack Vertically */}
      <div className="flex flex-col gap-2 w-full">
        {/* Tambah ke Keranjang */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stok === 0}
          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 border-2 ${
            !selectedVariant || selectedVariant.stok === 0
              ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
              : "border-orange-500 text-orange-500 bg-white hover:bg-orange-50"
          }`}
        >
          <FiShoppingCart className="w-4 h-4" />
          <span className="whitespace-nowrap">Tambah ke Keranjang</span>
        </button>

        {/* Pesan Sekarang */}
        <button
          onClick={handleOrderNow}
          disabled={!selectedVariant || selectedVariant.stok === 0}
          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition ${
            !selectedVariant || selectedVariant.stok === 0
              ? "bg-gray-300 text-gray-100 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};
