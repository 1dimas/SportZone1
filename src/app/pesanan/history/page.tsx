"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPesananHistory, Pesanan } from "@/components/lib/services/pesanan.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });

const statusOrder: Record<string, number> = {
  pending: 0,
  diproses: 1,
  dikirim: 2,
  selesai: 3,
  dibatalkan: 4,
};

export default function PesananHistoryPage() {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("semua");

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

  const filtered = useMemo(() => {
    if (tab === "semua") return orders.slice().sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    return orders.filter((o) => o.status === tab).sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [orders, tab]);

  const statusTabs = [
    { key: "semua", label: "Semua" },
    { key: "pending", label: "Pending" },
    { key: "diproses", label: "Diproses" },
    { key: "dikirim", label: "Dikirim" },
    { key: "selesai", label: "Selesai" },
    { key: "dibatalkan", label: "Dibatalkan" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Riwayat Pesanan</h1>
          <p className="text-sm text-gray-600 mt-1">Lihat, lacak, dan kelola pesanan Anda.</p>
        </div>
        <Link href="/products">
          <Button variant="outline">Belanja lagi</Button>
        </Link>
      </div>

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

      {!loading && !error && (
        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList>
            {statusTabs.map((s) => (
              <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tab} className="mt-4">
            {filtered.length === 0 ? (
              <div className="text-gray-700">Tidak ada pesanan pada kategori ini.</div>
            ) : (
              <div className="space-y-4">
                {filtered.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="border-b">
                      <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-sm text-gray-700">{order.id}</span>
                        <div className="flex items-center gap-3">
                          <div className="text-sm">
                            <span className="text-gray-500 mr-2">Tanggal</span>
                            <span className="font-medium">{formatDate(order.tanggal_pesanan)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500 mr-2">Total</span>
                            <span className="font-medium">{formatCurrency(order.total_harga)}</span>
                          </div>
                          <Badge variant="outline" className="capitalize">{order.status}</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-4">
                      {order.pesanan_items && order.pesanan_items.length > 0 ? (
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
                      ) : (
                        <div className="text-sm text-gray-600">Tidak ada item untuk pesanan ini.</div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <Link href={`/pesanan/${order.id}`}>
                          <Button size="sm" variant="outline">Lihat Detail</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
