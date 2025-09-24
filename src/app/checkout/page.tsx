"use client";

import { useState } from "react";
import products from "@/app/data/products";
import Image from "next/image";

// Ambil produk pertama sebagai contoh
const product = products[0];

const formatRupiah = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const paymentMethods = [
  { name: "GoPay", icon: "/gopay.svg" },
  { name: "BCA Virtual Account", icon: "/bca.svg" },
  { name: "Alfamart / Alfamidi / Lawson / Dan+Dan", icon: "/alfamart.svg" },
  { name: "Mandiri Virtual Account", icon: "/mandiri.svg" },
];

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].name);
  const [useInsurance, setUseInsurance] = useState(true);
  const [note, setNote] = useState("");
  const shippingCost = 20000;
  const insuranceCost = useInsurance ? 131900 : 0;
  const serviceFee = 1000;
  const appFee = 1000;
  const total =
    product.price + shippingCost + insuranceCost + serviceFee + appFee;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="border-b bg-white px-8 py-3 flex items-center">
        <span className="text-2xl font-bold text-orange-600">SportZone</span>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kiri */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Alamat */}
            <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-2">
              <div className="font-semibold text-gray-800 mb-2">ALAMAT PENGIRIMAN</div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <span className="font-bold">Rumah - User</span>
                  <div className="text-sm text-gray-600">
                    Jl. Kapitan 899, Kec. Tapos, Kota Depok, Jawa Barat, Tapos, Kota Depok, Jawa Barat, 628980870883
                  </div>
                </div>
                <button className="border px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium">
                  Ganti
                </button>
              </div>
            </div>
            {/* Produk & Pengiriman */}
            <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-contain bg-gray-100"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                </div>
                <div className="font-bold text-orange-600 text-lg whitespace-nowrap">
                  {formatRupiah(product.price)}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked readOnly className="accent-orange-500" />
                  Proteksi Rusak Total 3 Bulan (Rp250)
                </label>
                <div className="border rounded p-3 flex flex-col gap-2">
                  <div className="font-medium text-sm">Reguler</div>
                  <div className="text-xs text-gray-500">J&T Kargo (20.000) <span className="ml-2">Estimasi tiba besok - 15 Sep</span></div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={useInsurance}
                      onChange={() => setUseInsurance(!useInsurance)}
                      className="accent-orange-500"
                    />
                    Pakai Asuransi Pengirim (Rp{insuranceCost.toLocaleString("id-ID")})
                  </label>
                </div>
                <div className="flex flex-col mt-2">
                  <label htmlFor="note" className="text-xs text-gray-600 mb-1">Kasih Catatan</label>
                  <textarea
                    id="note"
                    maxLength={200}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="border rounded p-2 text-sm resize-none"
                    rows={2}
                    placeholder="Tulis catatan untuk penjual (opsional)"
                  />
                  <div className="text-xs text-gray-400 text-right">{note.length}/200</div>
                </div>
              </div>
            </div>
          </div>
          {/* Kanan */}
          <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800">Metode Pembayaran</div>
              <span className="text-xs text-orange-500 cursor-pointer">Lihat Semua..</span>
            </div>
            <div className="flex flex-col gap-3">
              {paymentMethods.map((method) => (
                <label key={method.name} className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded hover:bg-orange-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === method.name}
                    onChange={() => setSelectedPayment(method.name)}
                    className="accent-orange-500"
                  />
                  <Image src={method.icon} alt={method.name} width={28} height={28} />
                  <span className="font-medium text-sm">{method.name}</span>
                </label>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="font-semibold mb-2">Cek Ringkasan Transaksimu,yuk</div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Harga (1 Barang)</span>
                <span>{formatRupiah(product.price)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Ongkos Kirim</span>
                <span>{formatRupiah(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Asuransi Pengiriman</span>
                <span>{formatRupiah(insuranceCost)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Biaya Layanan</span>
                <span>{formatRupiah(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Biaya Jasa Aplikasi</span>
                <span>{formatRupiah(appFee)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-3 mt-2">
                <span>Total Tagihan</span>
                <span className="text-orange-600">{formatRupiah(total)}</span>
              </div>
            </div>
            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow hover:shadow-md text-lg"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
