// components/Detailpage/ProductActions.tsx
'use client';

import { useState, useEffect } from 'react';
import type { ProductVariant } from '@/app/data/products';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { getVarianByProduk } from '@/components/lib/services/produk.service';


type ProductData = {
  variants: ProductVariant[];
  name: string;
  price: number;
  image: string;
  id: string;
};

type ProductActionsProps = {
  product: ProductData;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
  onOrderNow?: (variant: ProductVariant, quantity: number) => void;
};

export const ProductActions: React.FC<ProductActionsProps> = ({ product, onAddToCart, onOrderNow }) => {
  const [selectedSize, setSelectedSize] = useState<string | number | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
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
        console.error('Failed to fetch variants:', error);
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
  const hasSizes = variants.some(v => v.ukuran !== undefined || v.size !== undefined);
  const hasColors = variants.some(v => v.warna !== undefined || v.color !== undefined);

  const availableSizes = hasSizes ? [...new Set(variants.map(v => v.ukuran || v.size).filter(Boolean))] : [];
  const availableColors = hasColors ? [...new Set(variants.map(v => v.warna || v.color).filter(Boolean))] : [];

  // Cari variant yang sesuai dengan selected size & color
  const selectedVariant = variants.find(v =>
    (hasSizes ? (v.ukuran || v.size) === selectedSize : true) &&
    (hasColors ? (v.warna || v.color) === selectedColor : true)
  );

  // Set default variant saat load produk
  useEffect(() => {
    if (variants.length > 0 && !loadingVariants) {
      const firstVariant = variants[0];
      if (hasSizes && (firstVariant.ukuran || firstVariant.size) !== undefined && selectedSize === undefined) {
        setSelectedSize(firstVariant.ukuran || firstVariant.size);
      }
      if (hasColors && (firstVariant.warna || firstVariant.color) !== undefined && selectedColor === undefined) {
        setSelectedColor(firstVariant.warna || firstVariant.color);
      }
    }
  }, [variants, hasSizes, hasColors, selectedSize, selectedColor, loadingVariants]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Silakan pilih varian terlebih dahulu.');
      return;
    }
    if (quantity > selectedVariant.stok) {
      alert(`Stok tidak mencukupi. Maksimal ${selectedVariant.stok} buah`);
      return;
    }
    onAddToCart(selectedVariant, quantity);
  };

  const handleOrderNow = () => {
    if (!selectedVariant) {
      alert('Silakan pilih varian terlebih dahulu.');
      return;
    }
    if (quantity > selectedVariant.stok) {
      alert(`Stok tidak mencukupi. Maksimal ${selectedVariant.stok} buah`);
      return;
    }
    if (onOrderNow) {
      onOrderNow(selectedVariant, quantity);
    }
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
          <label className="block text-xs text-gray-500 mb-1">Ukuran:</label>
          <select
            value={selectedSize || ''}
            onChange={e => setSelectedSize(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="">Pilih ukuran</option>
            {availableSizes.map((size, idx) => (
              <option key={idx} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}

      {/* Pilihan Warna */}
      {hasColors && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Warna:</label>
          <select
            value={selectedColor || ''}
            onChange={e => setSelectedColor(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="">Pilih warna</option>
            {availableColors.map((color, idx) => (
              <option key={idx} value={color}>{color}</option>
            ))}
          </select>
        </div>
      )}

      {/* Informasi Variant yang Dipilih */}
      {selectedVariant && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Variant Dipilih:</h4>
          <div className="text-sm text-blue-800">
            {hasSizes && hasColors && (
              <p>Ukuran: {selectedSize} | Warna: {selectedColor}</p>
            )}
            {hasSizes && !hasColors && (
              <p>Ukuran: {selectedSize}</p>
            )}
            {hasColors && !hasSizes && (
              <p>Warna: {selectedColor}</p>
            )}
            <p className="mt-1">Stok tersedia: {selectedVariant.stok}</p>
            {selectedVariant.harga && (
              <p className="mt-1">Harga variant: Rp {selectedVariant.harga.toLocaleString("id-ID")}</p>
            )}
          </div>
        </div>
      )}

      {/* Jumlah */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="p-2 border rounded"
        ><FiMinus /></button>
        <span className="px-3">{quantity}</span>
        <button
          onClick={() => setQuantity(q => q + 1)}
          className="p-2 border rounded"
        ><FiPlus /></button>
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stok === 0}
          className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
            !selectedVariant || selectedVariant.stok === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
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
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};
