"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getPesananHistory,
  Pesanan,
  cancelOrder,
} from "@/components/lib/services/pesanan.service";
import {
  IconArrowLeft,
  IconPackage,
  IconMapPin,
  IconCalendar,
  IconReceipt,
  IconStar,
  IconTruck,
  IconLoader2,
  IconAlertCircle,
  IconBox
} from "@tabler/icons-react";
import { createRating, checkUserRating } from "@/components/lib/services/rating.service";
import { getProfile } from "@/components/lib/services/auth.service";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);

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

const getStatusBadgeStyle = (status: string) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    diproses: "bg-blue-50 text-blue-700 border-blue-200",
    dikirim: "bg-purple-50 text-purple-700 border-purple-200",
    selesai: "bg-green-50 text-green-700 border-green-200",
    dibatalkan: "bg-gray-50 text-gray-700 border-gray-200",
    dikembalikan: "bg-red-50 text-red-700 border-red-200",
  };
  return styles[status] || styles.pending;
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
  const [ratedItems, setRatedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const me = await getProfile();
        if (me?.id) setUserId(String(me.id));
      } catch { }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPesananHistory();
        if (mounted) setOrders(data);

        // Check which items have already been rated by the user
        if (userId && data.length > 0) {
          const ratedItemsCheck = await checkRatedItems(data, userId);
          if (mounted) setRatedItems(ratedItemsCheck);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Gagal mengambil data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

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
      toast.success("Pesanan berhasil dibatalkan");

      const data = await getPesananHistory();
      setOrders(data);
    } catch (err: any) {
      toast.error(err?.message || "Gagal membatalkan pesanan");
    } finally {
      setCancelingOrderId(null);
    }
  };

  // Check which items have already been rated by the user
  const checkRatedItems = async (orders: Pesanan[], userId: string) => {
    const ratedItems: Record<string, boolean> = {};

    for (const order of orders) {
      if (order.pesanan_items) {
        for (const item of order.pesanan_items) {
          // Create a unique key for each order-item combination
          const itemKey = `${order.id}-${item.id_produk}`;
          ratedItems[itemKey] = await checkUserRating(userId, item.id_produk);
        }
      }
    }

    return ratedItems;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <Link href="/">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Riwayat Pesanan
              </h1>
              <p className="text-sm text-gray-500">
                Kelola dan lacak semua pesanan Anda dengan mudah
              </p>
            </div>

            <Link href="/pengembalian/history">
              <Button variant="outline" className="shadow-sm">
                <IconPackage className="w-4 h-4 mr-2" />
                Riwayat Pengembalian
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <IconLoader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600">Memuat riwayat pesanan...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <IconAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">Terjadi Kesalahan</p>
                  <p className="text-sm text-red-700">{error}</p>
                  {error.toLowerCase().includes("unauthorized") && (
                    <p className="text-sm text-red-600 mt-2">
                      Sesi berakhir. Silakan{" "}
                      <Link href="/login" className="underline font-semibold">
                        login
                      </Link>{" "}
                      kembali.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <Card className="border-0 shadow-lg shadow-gray-200/50">
            <CardContent className="py-12">
              <div className="text-center">
                <IconBox className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Belum ada pesanan
                </h3>
                <p className="text-gray-600 mb-6">
                  Mulai berbelanja dan buat pesanan pertama Anda!
                </p>
                <Link href="/">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Mulai Belanja
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content with Tabs */}
        {!loading && !error && orders.length > 0 && (
          <Tabs value={tab} onValueChange={setTab}>
            {/* Tabs Filter */}
            <TabsList className="bg-white border-0 shadow-sm p-1.5 rounded-xl mb-6 flex-wrap h-auto">
              {statusTabs.map((s) => (
                <TabsTrigger
                  key={s.key}
                  value={s.key}
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white 
                            rounded-lg px-4 py-2.5 text-sm font-medium transition-all
                            hover:bg-gray-50 data-[state=active]:shadow-md"
                >
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={tab}>
              {filtered.length === 0 ? (
                <Card className="border-0 shadow-lg shadow-gray-200/50">
                  <CardContent className="py-12 text-center">
                    <IconBox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-600">
                      Tidak ada pesanan pada kategori ini.
                    </p>
                  </CardContent>
                </Card>
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
                        className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        {/* Card Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge className={`${getStatusBadgeStyle(order.status)} px-3 py-1 font-semibold capitalize border`}>
                                {order.status}
                              </Badge>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <IconCalendar className="w-4 h-4" />
                                {formatDate(order.tanggal_pesanan)}
                              </div>
                            </div>
                            <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              #{order.id.substring(0, 12)}
                            </code>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          {firstItem ? (
                            <div className="flex gap-5">
                              {/* Product Image - TIDAK CROP */}
                              <div className="w-32 h-32 bg-gray-50 rounded-xl flex-shrink-0 border border-gray-100 overflow-hidden p-2">
                                <div className="w-full h-full relative">
                                  <img
                                    src={
                                      (firstItem as any)?.produk?.gambar?.[0] ||
                                      (firstItem as any)?.produk?.gambar_url ||
                                      "/products/kao.jpeg"
                                    }
                                    alt={firstItem.produk?.nama}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">
                                  {firstItem.produk?.nama || "Produk"}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                  <IconPackage className="w-4 h-4" />
                                  <span>
                                    {firstItem.kuantitas} barang
                                    {firstItem.produk_varian &&
                                      (() => {
                                        const varian = firstItem.produk_varian;
                                        const parts = [varian.warna, varian.ukuran].filter(Boolean);
                                        return parts.length > 0 ? (
                                          <span className="text-gray-500">
                                            {" "}• {parts.join(" / ")}
                                          </span>
                                        ) : null;
                                      })()}
                                  </span>
                                </div>

                                {otherItemsCount > 0 && (
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg mb-3">
                                    <IconBox className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-700">
                                      + {otherItemsCount} produk lainnya
                                    </span>
                                  </div>
                                )}

                                {/* Shipping Address */}
                                {(order.kota || order.provinsi) && (
                                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg mb-3">
                                    <IconMapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 mb-0.5">
                                        Dikirim ke
                                      </p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {[order.kota, order.provinsi].filter(Boolean).join(", ")}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* ETA Badge */}
                                {(order.status === "pending" ||
                                  order.status === "diproses" ||
                                  order.status === "dikirim") &&
                                  order.eta_min &&
                                  order.eta_max && (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                      <IconTruck className="w-5 h-5 text-blue-600" />
                                      <div>
                                        <p className="text-xs font-medium text-blue-900 mb-0.5">
                                          Estimasi Tiba
                                        </p>
                                        <p className="text-sm font-semibold text-blue-700">
                                          {order.eta_min === order.eta_max
                                            ? `${order.eta_min} hari kerja`
                                            : `${order.eta_min}-${order.eta_max} hari kerja`}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <IconBox className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">Tidak ada item</p>
                            </div>
                          )}

                          {/* Footer with Total & Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {formatCurrency(order.total_harga)}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Cancel Button */}
                              {(order.status === "pending" || order.status === "diproses") && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={cancelingOrderId === order.id}
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="bg-red-500 hover:bg-red-600 shadow-sm"
                                >
                                  {cancelingOrderId === order.id ? (
                                    <>
                                      <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Membatalkan...
                                    </>
                                  ) : (
                                    "Batalkan"
                                  )}
                                </Button>
                              )}

                              {/* Detail Button */}
                              <Link href={`/pesanan/${order.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-orange-600 hover:bg-orange-700 shadow-sm"
                                >
                                  <IconReceipt className="w-4 h-4 mr-2" />
                                  Lihat Detail
                                </Button>
                              </Link>

                              {/* Review Button */}
                              {order.status === "selesai" && (
                                <div className="w-full sm:w-auto">
                                  {order.pesanan_items && order.pesanan_items.length > 0 ? (
                                    (() => {
                                      const firstItem = order.pesanan_items[0];
                                      const itemKey = `${order.id}-${firstItem.id_produk}`;
                                      const hasRated = ratedItems[itemKey] || false;

                                      return hasRated ? (
                                        <div key={itemKey} className="inline-flex items-center gap-2 text-sm text-green-600">
                                          <IconStar className="w-4 h-4 text-green-500" />
                                          <span>Terima kasih atas ulasan Anda!</span>
                                        </div>
                                      ) : activeReviewOrderId === order.id ? (
                                        <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 mt-3">
                                          <p className="text-sm font-semibold text-gray-900 mb-3">
                                            Beri Rating & Ulasan
                                          </p>
                                          <div className="flex items-center gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map((v) => (
                                              <button
                                                key={v}
                                                disabled={pending}
                                                onClick={() => setCurrentRating(v)}
                                                className={`p-1.5 rounded-lg transition-colors ${pending ? "opacity-50" : "hover:bg-gray-100"
                                                  }`}
                                              >
                                                <IconStar
                                                  className={`w-6 h-6 ${v <= currentRating
                                                      ? "text-yellow-500 fill-yellow-400"
                                                      : "text-gray-300"
                                                    }`}
                                                />
                                              </button>
                                            ))}
                                          </div>
                                          <Textarea
                                            placeholder="Bagikan pengalaman Anda (opsional)"
                                            value={currentReview}
                                            onChange={(e) => setCurrentReview(e.target.value)}
                                            className="mb-3 bg-white"
                                            rows={3}
                                          />
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
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
                                              size="sm"
                                              disabled={pending}
                                              className="bg-orange-600 hover:bg-orange-700"
                                              onClick={async () => {
                                                if (!userId) return toast.warning("Silakan login kembali");
                                                if (!currentRating) return toast.warning("Pilih rating 1-5");
                                                if (!firstItem.id_produk) return toast.error("Produk tidak ditemukan");
                                                try {
                                                  setPending(true);
                                                  await createRating({
                                                    userId,
                                                    produkId: firstItem.id_produk,
                                                    rating: currentRating,
                                                    review: currentReview.trim() || undefined,
                                                  });
                                                  toast.success("Terima kasih atas ulasan Anda!");
                                                  setActiveReviewOrderId(null);
                                                  setCurrentRating(0);
                                                  setCurrentReview("");
                                                  // Update the rated items state after successful rating
                                                  const itemKey = `${order.id}-${firstItem.id_produk}`;
                                                  setRatedItems(prev => ({ ...prev, [itemKey]: true }));
                                                } catch (e: any) {
                                                  toast.error(e?.message || "Gagal mengirim ulasan");
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
                                          onClick={() => {
                                            setActiveReviewOrderId(order.id);
                                            setCurrentRating(0);
                                            setCurrentReview("");
                                          }}
                                          className="shadow-sm"
                                        >
                                          <IconStar className="w-4 h-4 mr-2" />
                                          Beri Ulasan
                                        </Button>
                                      );
                                    })()
                                  ) : null}
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
