// components/product/ProductActions.tsx
'use client';

import { useState } from 'react';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

// 1. Definisikan tipe data untuk prop 'product' yang akan diterima
//    Sesuaikan isinya dengan data yang Anda kirim
type ProductData = {
  sizes: number[];
  // Anda bisa tambahkan properti lain jika dibutuhkan di sini
};

// 2. Definisikan tipe untuk semua props yang diterima komponen ini
type ProductActionsProps = {
  product: ProductData;
};

// 3. Terima props di dalam parameter fungsi komponen
export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Pilihan Ukuran */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Pilih Ukuran</h3>
        <div className="flex flex-wrap gap-2">
          {/* 4. Gunakan data dari props (product.sizes), BUKAN dari dummyProduct lagi */}
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-md transition-colors ${selectedSize === size ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:border-slate-400'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Pemilih Jumlah */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Jumlah</h3>
        <div className="flex items-center border rounded-md w-fit">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-slate-100 rounded-l-md"><FiMinus/></button>
          <span className="px-6 py-2 font-bold">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 hover:bg-slate-100 rounded-r-md"><FiPlus/></button>
        </div>
      </div>

      {/* Tombol Aksi */}
      <button className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors duration-300 hover:bg-orange-600 text-lg shadow-lg hover:shadow-orange-300">
        <FiShoppingCart />
        <span>Tambah Keranjang</span>
      </button>
    </div>
  );
};