"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPesananHistory, Pesanan } from "@/components/lib/services/pesanan.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });

export default function PesananHistoryPage() {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPesananHistory();
        if (mounted) setOrders(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Gagal mengambil data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Riwayat Pesanan</h1>

      {loading && <div className="text-gray-600">Memuat riwayat pesanan...</div>}
      {error && (
        <div className="text-red-600">
          {error}
          {error.toLowerCase().includes("unauthorized") && (
            <span className="block mt-2 text-sm text-gray-600">
              Sesi berakhir. Silakan <Link href="/login" className="text-orange-600 underline">login</Link> kembali.
            </span>
          )}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-gray-700">Belum ada pesanan. Yuk belanja sekarang!</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm text-gray-500">ID Pesanan</div>
                  <div className="font-mono text-sm">{order.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tanggal</div>
                  <div className="font-medium">{formatDate(order.tanggal_pesanan)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-medium">{formatCurrency(order.total_harga)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border">
                    {order.status}
                  </span>
                </div>
                <div>
                  <Link href={`/pesanan/${order.id}`} className="text-orange-600 hover:text-orange-700 font-medium">
                    Lihat Detail
                  </Link>
                </div>
              </div>

              {order.pesanan_items && order.pesanan_items.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Item</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {order.pesanan_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
                        <div className="truncate max-w-[60%]">
                          {item.produk?.nama || "Produk"}
                          {item.produk_varian && (
                            <span className="text-gray-500 ml-1">
                              ({item.produk_varian.warna_varian}/{item.produk_varian.ukuran})
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600">x{item.kuantitas}</div>
                        <div className="font-medium">{formatCurrency(Number(item.harga_satuan))}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
