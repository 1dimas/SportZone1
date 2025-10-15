// components/product/ProductActions.tsx
'use client';

import { useState } from 'react';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import type { ProductVariant } from '@/app/data/products';

// 1. Definisikan tipe data untuk prop 'product' yang akan diterima
type ProductData = {
  variants: ProductVariant[];
  name: string;
  price: number;
  image: string;
  id: string;
};

// 2. Definisikan tipe untuk semua props yang diterima komponen ini
type ProductActionsProps = {
  product: ProductData;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
};

// 3. Terima props di dalam parameter fungsi komponen
export const ProductActions: React.FC<ProductActionsProps> = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Silakan pilih ukuran terlebih dahulu');
      return;
    }

    if (quantity > selectedVariant.stock) {
      alert(`Stok tidak mencukupi. Maksimal ${selectedVariant.stock} buah`);
      return;
    }

    onAddToCart(selectedVariant, quantity);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Pilihan Ukuran */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Pilih Ukuran</h3>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.size?.toString()}
              onClick={() => setSelectedVariant(variant)}
              disabled={variant.stock === 0}
              className={`px-4 py-2 border rounded-md transition-colors ${
                variant.stock === 0
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                  : selectedVariant?.size === variant.size
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:border-slate-400'
              }`}
            >
              {variant.size}
            </button>
          ))}
        </div>
      </div>

      {/* Pemilih Jumlah */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Jumlah</h3>
        <div className="flex items-center border rounded-md w-fit">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-4 py-2 hover:bg-slate-100 rounded-l-md"
          >
            <FiMinus/>
          </button>
          <span className="px-6 py-2 font-bold">{quantity}</span>
          <button
            onClick={() => {
              if (selectedVariant && quantity < selectedVariant.stock) {
                setQuantity(q => q + 1);
              }
            }}
            className={`px-4 py-2 hover:bg-slate-100 rounded-r-md ${
              selectedVariant && quantity >= selectedVariant.stock
                ? 'bg-gray-100 cursor-not-allowed'
                : ''
            }`}
            disabled={selectedVariant ? quantity >= selectedVariant.stock : true}
          >
            <FiPlus/>
          </button>
        </div>
      </div>

      {/* Stok Info */}
      {selectedVariant && (
        <div className="text-sm text-gray-600">
          Stok tersedia: {selectedVariant.stock} buah
        </div>
      )}

      {/* Tombol Aksi */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant || selectedVariant.stock === 0}
        className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors duration-300 hover:bg-orange-600 text-lg shadow-lg hover:shadow-orange-300 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        <FiShoppingCart />
        <span>Tambah Keranjang</span>
      </button>
    </div>
  );
};
