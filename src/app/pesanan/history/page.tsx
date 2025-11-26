"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getPesananHistory,
  Pesanan,
  cancelOrder,
} from "@/components/lib/services/pesanan.service";
// Import ShoppingBag (dipakai di Card) dan FiArrowLeft (untuk tombol kembali)
import { ShoppingBag, ArrowLeft, Star } from "lucide-react";
import { createRating } from "@/components/lib/services/rating.service";
import { getProfile } from "@/components/lib/services/auth.service";
import { Textarea } from "@/components/ui/textarea";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    amount
  );

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const statusOrder: Record<string, number> = {
  pending: 0,
  diproses: 1,
  dikirim: 2,
  selesai: 3,
  dibatalkan: 4,
  dikembalikan: 5,
};

export default function PesananHistoryPage() {
  const [orders, setOrders] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("semua");
  const [activeReviewOrderId, setActiveReviewOrderId] = useState<string | null>(null);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [currentReview, setCurrentReview] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await getProfile();
        if (me?.id) setUserId(String(me.id));
      } catch {}
    })();
  }, []);

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
    if (tab === "semua")
      return orders
        .slice()
        .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    return orders
      .filter((o) => o.status === tab)
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [orders, tab]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    try {
      setCancelingOrderId(orderId);
      await cancelOrder(orderId);
      alert("Pesanan berhasil dibatalkan");
      
      // Refresh order list
      const data = await getPesananHistory();
      setOrders(data);
    } catch (err: any) {
      alert(err?.message || "Gagal membatalkan pesanan");
    } finally {
      setCancelingOrderId(null);
    }
  };

  const statusTabs = [
    { key: "semua", label: "Semua" },
    { key: "pending", label: "Pending" },
    { key: "diproses", label: "Diproses" },
    { key: "dikirim", label: "Dikirim" },
    { key: "selesai", label: "Selesai" },
    { key: "dibatalkan", label: "Dibatalkan" },
    { key: "dikembalikan", label: "Dikembalikan" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* =======================================================
          1. TOMBOL KEMBALI DITAMBAHKAN DI SINI
          ======================================================= */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-700 hover:text-orange-500 px-0 hover:bg-transparent"
          asChild
        >
          <Link href="/">
            {/* GANTI INI: <FiArrowLeft className="w-5 h-5 mr-2" /> */}
            <ArrowLeft className="w-5 h-5 mr-2" /> {/* JADI INI */}
            Kembali ke Home
          </Link>
        </Button>
        {/* ======================================================= */}

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* 2. LOGO DIPASTIKAN TIDAK ADA */}

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Riwayat Pesanan
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Lihat, lacak, dan kelola pesanan Anda.
              </p>
            </div>
          </div>

          <Link href="/pengembalian/history">
            <Button variant="outline" size="sm">
              Lihat Riwayat Pengembalian
            </Button>
          </Link>
        </div>

        {/* ... Sisa kode (Loading, Error, Tabs, Cards) tetap sama ... */}

        {loading && (
          <div className="text-gray-600 flex items-center justify-center h-48">
            <svg
              className="animate-spin h-8 w-8 text-orange-500 mr-3"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Memuat riwayat pesanan...
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Terjadi Kesalahan! </strong>
            <span className="block sm:inline">{error}</span>
            {error.toLowerCase().includes("unauthorized") && (
              <span className="block mt-2 text-sm text-red-600">
                Sesi berakhir. Silakan{" "}
                <Link
                  href="/login"
                  className="text-red-800 underline font-medium"
                >
                  login
                </Link>{" "}
                kembali.
              </span>
            )}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div
            className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
            role="alert"
          >
            <p className="font-bold">Belum ada pesanan</p>
            <p>
              Sepertinya Anda belum melakukan pembelian apa pun. Yuk belanja
              sekarang!
            </p>
          </div>
        )}

        {!loading && !error && (
          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList className="bg-white p-1 rounded-lg shadow-sm">
              {statusTabs.map((s) => (
                <TabsTrigger
                  key={s.key}
                  value={s.key}
                  className="data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md
                             data-[state=active]:border-orange-600 data-[state=active]:border-2
                             rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
                             hover:bg-gray-100"
                >
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={tab} className="mt-6">
              {filtered.length === 0 ? (
                <div className="text-gray-700 p-4 bg-white rounded-lg shadow-sm">
                  Tidak ada pesanan pada kategori ini.
                </div>
              ) : (
                <div className="space-y-5">
                  {filtered.map((order) => {
                    const firstItem = order.pesanan_items?.[0];
                    const otherItemsCount = order.pesanan_items
                      ? order.pesanan_items.length - 1
                      : 0;

                    return (
                      <Card
                        key={order.id}
                        className="overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-lg rounded-lg"
                      >
                        <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <ShoppingBag className="w-4 h-4 text-gray-500" />
                            <Badge
                              variant="outline"
                              className="capitalize font-semibold text-gray-800 bg-white border-gray-300"
                            >
                              {order.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {formatDate(order.tanggal_pesanan)}
                            </span>
                          </div>
                          <span className="text-sm font-mono text-gray-500">
                            #{order.id.substring(0, 8)}
                          </span>
                        </CardHeader>

                        <CardContent className="p-4">
                          {firstItem ? (
                            <div className="flex gap-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                <img
                                  src={
                                    (firstItem as any)?.produk?.gambar?.[0] ||
                                    (firstItem as any)?.produk?.gambar_url ||
                                    "/products/kao.jpeg"
                                  }
                                  alt={firstItem.produk?.nama}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="font-bold text-gray-800 truncate text-lg">
                                  {firstItem.produk?.nama || "Produk"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {firstItem.kuantitas} barang
                                  {firstItem.produk_varian &&
                                    (() => {
                                      const varian = firstItem.produk_varian;
                                      const color =
                                        varian.warna;
                                      const size = varian.ukuran;
                                      let variantStr = "";
                                      if (color && size) {
                                        variantStr = `${color}/${size}`;
                                      } else if (color) {
                                        variantStr = color;
                                      } else if (size) {
                                        variantStr = size;
                                      }
                                      return variantStr ? (
                                        <span className="ml-1">
                                          ({variantStr})
                                        </span>
                                      ) : null;
                                    })()}
                                </p>
                                {otherItemsCount > 0 && (
                                  <p className="text-sm text-orange-600 font-medium mt-2">
                                    + {otherItemsCount} produk lain
                                  </p>
                                )}
                                
                                {/* Kota dan Provinsi */}
                                {(order.kota || order.provinsi) && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Dikirim ke:</p>
                                    <p className="text-sm text-gray-700">
                                      {[order.kota, order.provinsi].filter(Boolean).join(", ")}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Show ETA for pending, diproses, dikirim status */}
                                {(order.status === "pending" || 
                                  order.status === "diproses" || 
                                  order.status === "dikirim") && 
                                  order.eta_min && 
                                  order.eta_max && (
                                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-xs font-semibold text-blue-800 mb-1">
                                      📦 Estimasi Kedatangan
                                    </p>
                                    <p className="text-sm text-blue-700">
                                      {order.eta_min === order.eta_max 
                                        ? `${order.eta_min} hari`
                                        : `${order.eta_min}-${order.eta_max} hari`}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">
                              Tidak ada item untuk pesanan ini.
                            </div>
                          )}

                          <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200">
                            <div>
                              <span className="text-sm text-gray-500 block">
                                Total Belanja
                              </span>
                              <p className="font-bold text-2xl text-orange-600">
                                {formatCurrency(order.total_harga)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {/* Tombol Batalkan Pesanan untuk status pending dan diproses */}
                              {(order.status === "pending" || order.status === "diproses") && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={cancelingOrderId === order.id}
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md"
                                >
                                  {cancelingOrderId === order.id ? "Membatalkan..." : "Batalkan"}
                                </Button>
                              )}
                              
                              <Link href={`/pesanan/${order.id}`}>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md"
                                >
                                  Lihat Detail
                                </Button>
                              </Link>
                              {order.status === "selesai" && (
                                <div className="flex flex-col items-end gap-3 w-full">
                                  {activeReviewOrderId === order.id ? (
                                    <div className="w-full mt-2 border rounded-md p-3 bg-gray-50">
                                      <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((v) => (
                                          <button
                                            key={v}
                                            aria-label={`pilih rating ${v}`}
                                            disabled={pending}
                                            onClick={() => setCurrentRating(v)}
                                            className={`p-1 rounded ${pending ? "opacity-50" : "hover:bg-gray-100"}`}
                                          >
                                            <Star
                                              className={
                                                v <= currentRating
                                                  ? "w-5 h-5 text-yellow-500 fill-yellow-400"
                                                  : "w-5 h-5 text-gray-300"
                                              }
                                            />
                                          </button>
                                        ))}
                                      </div>
                                      <Textarea
                                        placeholder="Tulis ulasan Anda (opsional)"
                                        value={currentReview}
                                        onChange={(e) => setCurrentReview(e.target.value)}
                                        className="mb-3"
                                      />
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          variant="outline"
                                          disabled={pending}
                                          onClick={() => {
                                            setActiveReviewOrderId(null);
                                            setCurrentRating(0);
                                            setCurrentReview("");
                                          }}
                                        >
                                          Batal
                                        </Button>
                                        <Button
                                          disabled={pending}
                                          className="bg-orange-600 hover:bg-orange-700 text-white"
                                          onClick={async () => {
                                            if (!userId) return alert("Silakan login kembali");
                                            if (!currentRating) return alert("Pilih rating 1-5");
                                            const produkId = order.pesanan_items?.[0]?.id_produk;
                                            if (!produkId) return alert("Produk tidak ditemukan");
                                            try {
                                              setPending(true);
                                              await createRating({ 
                                                userId, 
                                                produkId, 
                                                rating: currentRating,
                                                review: currentReview.trim() || undefined
                                              });
                                              alert("Terima kasih atas ulasan dan rating Anda");
                                              setActiveReviewOrderId(null);
                                              setCurrentRating(0);
                                              setCurrentReview("");
                                            } catch (e: any) {
                                              alert(e?.message || "Gagal mengirim ulasan/rating");
                                            } finally {
                                              setPending(false);
                                            }
                                          }}
                                        >
                                          Kirim Ulasan
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setActiveReviewOrderId(order.id);
                                        setCurrentRating(0);
                                        setCurrentReview("");
                                      }}
                                    >
                                      Beri Ulasan
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
