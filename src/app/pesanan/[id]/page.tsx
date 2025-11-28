"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Pesanan, getPesananById, cancelOrder } from "@/components/lib/services/pesanan.service";
import { getPengembalianByUser, Pengembalian } from "@/components/lib/services/pengembalian.service";
import { 
  IconCheck, 
  IconTruck, 
  IconClock, 
  IconMapPin, 
  IconX, 
  IconPackageExport,
  IconPackage,
  IconReceipt,
  IconArrowLeft,
  IconCopy,
  IconAlertCircle
} from "@tabler/icons-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", { 
    weekday: 'long',
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

const STATUS_FLOW = ["pending", "diproses", "dikirim", "selesai"] as const;
type StatusKey = typeof STATUS_FLOW[number] | "dibatalkan" | "dikembalikan";

const getStatusBadgeStyle = (status: StatusKey) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    diproses: "bg-blue-50 text-blue-700 border-blue-200",
    dikirim: "bg-purple-50 text-purple-700 border-purple-200",
    selesai: "bg-green-50 text-green-700 border-green-200",
    dibatalkan: "bg-gray-50 text-gray-700 border-gray-200",
    dikembalikan: "bg-red-50 text-red-700 border-red-200",
  };
  return styles[status] || styles.pending;
};

function StatusTimeline({ status }: { status: StatusKey }) {
  const currentIndex = STATUS_FLOW.indexOf(status as any);
  const cancelled = status === "dibatalkan";
  const returned = status === "dikembalikan";

  const items = [
    { key: "pending", label: "Pending", icon: IconClock },
    { key: "diproses", label: "Diproses", icon: IconCheck },
    { key: "dikirim", label: "Dikirim", icon: IconTruck },
    { key: "selesai", label: "Selesai", icon: IconPackage },
  ] as const;

  if (cancelled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
          <IconX className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Pesanan Dibatalkan</p>
          <p className="text-xs text-gray-500">Pesanan ini telah dibatalkan</p>
        </div>
      </div>
    );
  }

  if (returned) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-lg border border-red-100">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
          <IconPackageExport className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-red-900">Pesanan Dikembalikan</p>
          <p className="text-xs text-red-600">Pengembalian telah diproses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const done = currentIndex >= idx;
          const active = currentIndex === idx;
          
          return (
            <div key={item.key} className="flex flex-col items-center flex-1 relative">
              {/* Connector Line */}
              {idx < items.length - 1 && (
                <div className={`absolute top-5 left-[50%] w-full h-0.5 ${
                  done ? 'bg-orange-500' : 'bg-gray-200'
                }`} style={{ zIndex: 0 }} />
              )}
              
              {/* Icon Circle */}
              <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                done 
                  ? 'bg-orange-500 shadow-lg shadow-orange-500/30' 
                  : 'bg-white border-2 border-gray-200'
              }`}>
                <Icon className={`w-5 h-5 ${done ? 'text-white' : 'text-gray-400'}`} />
              </div>
              
              {/* Label */}
              <span className={`mt-2 text-xs font-medium text-center ${
                active ? 'text-orange-600' : done ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PesananDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pengembalian, setPengembalian] = useState<Pengembalian | null>(null);
  const [cancelingOrder, setCancelingOrder] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const data = await getPesananById(id);
        if (mounted) setOrder(data);
        
        try {
          const pengembalianList = await getPengembalianByUser();
          const activePengembalian = pengembalianList.find(p => p.pesanan_id === id);
          if (activePengembalian && mounted) {
            setPengembalian(activePengembalian);
          }
        } catch {}
      } catch (err: any) {
        if (mounted) setError(err?.message || "Gagal mengambil detail pesanan");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const subtotal = useMemo(() => {
    if (!order?.pesanan_items) return 0;
    return order.pesanan_items.reduce((sum, item) => sum + Number(item.harga_satuan) * item.kuantitas, 0);
  }, [order]);

  const handleCancelOrder = async () => {
    if (!id) return;
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    try {
      setCancelingOrder(true);
      await cancelOrder(id);
      alert("Pesanan berhasil dibatalkan");
      
      const data = await getPesananById(id);
      setOrder(data);
    } catch (err: any) {
      alert(err?.message || "Gagal membatalkan pesanan");
    } finally {
      setCancelingOrder(false);
    }
  };

  const handleCopyId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push("/pesanan/history")}
              className="mb-3 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Riwayat
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Detail Pesanan</h1>
            <p className="text-sm text-gray-500 mt-1">Informasi lengkap pesanan Anda</p>
          </div>

          {order && (order.status === "pending" || order.status === "diproses") && (
            <Button 
              variant="destructive" 
              disabled={cancelingOrder}
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-600 shadow-sm"
            >
              <IconX className="w-4 h-4 mr-2" />
              {cancelingOrder ? "Membatalkan..." : "Batalkan Pesanan"}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <IconAlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">{error}</p>
                  {error.toLowerCase().includes("unauthorized") && (
                    <p className="text-sm text-red-700 mt-1">
                      Sesi berakhir. Silakan <Link href="/login" className="underline font-medium">login</Link> kembali.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informasi Pesanan & Status */}
            <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 rounded-2xl">
              <CardHeader className="border-b border-gray-100 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <IconReceipt className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ID Pesanan</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-semibold text-gray-900">
                          #{order.id.slice(0, 8)}...
                        </code>
                        <button
                          onClick={handleCopyId}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy ID"
                        >
                          <IconCopy className="w-4 h-4 text-gray-400" />
                        </button>
                        {copiedId && (
                          <span className="text-xs text-green-600 font-medium">Tersalin!</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusBadgeStyle(order.status as StatusKey)} px-4 py-1.5 font-medium capitalize border`}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="py-6 space-y-6">
                {/* Tanggal & Total */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <IconClock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tanggal Pesanan</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(order.tanggal_pesanan)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                    <IconReceipt className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-orange-700 mb-1">Total Pembayaran</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(order.total_harga)}</p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Status Pengiriman</p>
                  <StatusTimeline status={order.status as StatusKey} />
                </div>
              </CardContent>
            </Card>

            {/* Alamat Pengiriman */}
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <IconMapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Alamat Pengiriman</h3>
                </div>
              </CardHeader>
              <CardContent className="py-6 space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Alamat Lengkap</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    {order.alamat_pengiriman}
                  </p>
                </div>
                
                {(order.kota || order.provinsi) && (
                  <>
                    <Separator className="bg-gray-100" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Kota/Provinsi</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {[order.kota, order.provinsi].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </>
                )}
                
                {/* ETA Badge */}
                {(order.status === "pending" || 
                  order.status === "diproses" || 
                  order.status === "dikirim") && 
                  order.eta_min && 
                  order.eta_max && (
                  <>
                    <Separator className="bg-gray-100" />
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <IconTruck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-medium text-blue-900 mb-0.5">Estimasi Tiba</p>
                        <p className="text-sm font-semibold text-blue-700">
                          {order.eta_min === order.eta_max 
                            ? `${order.eta_min} hari kerja`
                            : `${order.eta_min}-${order.eta_max} hari kerja`}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Info Pengembalian */}
            {(order.status === "dikirim" || order.status === "selesai" || order.status === "dikembalikan") && (
              <Card className="lg:col-span-3 border-0 shadow-lg shadow-gray-200/50 rounded-2xl">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <IconPackageExport className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Pengembalian Produk</h3>
                  </div>
                </CardHeader>
                <CardContent className="py-6">
                  {pengembalian ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Status Pengembalian</p>
                          <Badge className={`
                            ${pengembalian.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                            ${pengembalian.status === "approved" ? "bg-green-100 text-green-800 border-green-200" : ""}
                            ${pengembalian.status === "rejected" ? "bg-red-100 text-red-800 border-red-200" : ""}
                            px-3 py-1 font-medium border
                          `}>
                            {pengembalian.status === "pending" && "Menunggu Persetujuan"}
                            {pengembalian.status === "approved" && "Disetujui"}
                            {pengembalian.status === "rejected" && "Ditolak"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Alasan</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{pengembalian.alasan}</p>
                        </div>
                      </div>
                      {pengembalian.catatan_admin && (
                        <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-xs font-semibold text-blue-900 mb-2">Catatan dari Admin</p>
                          <p className="text-sm text-blue-800">{pengembalian.catatan_admin}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <IconPackageExport className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-4">
                        Ada masalah dengan pesanan Anda? Ajukan pengembalian sekarang.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/pesanan/${order.id}/pengembalian`)}
                        className="shadow-sm"
                      >
                        <IconPackageExport className="w-4 h-4 mr-2" />
                        Ajukan Pengembalian
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Daftar Item Produk */}
            <Card className="lg:col-span-2 border-0 shadow-lg shadow-gray-200/50 rounded-2xl">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <IconPackage className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Item Pesanan</h3>
                </div>
              </CardHeader>
              <CardContent className="py-6">
                {order.pesanan_items && order.pesanan_items.length > 0 ? (
                  <div className="space-y-4">
                    {order.pesanan_items.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {item.produk?.nama || "Produk"}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                              {item.produk_varian
                                ? (
                                    [
                                      item.produk_varian.warna_varian,
                                      item.produk_varian.ukuran,
                                    ]
                                      .filter((v) => v && String(v).trim().length > 0)
                                      .join(" • ") || "Varian standar"
                                  )
                                : "Varian standar"}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                {formatCurrency(Number(item.harga_satuan))} × {item.kuantitas}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(Number(item.harga_satuan) * item.kuantitas)}
                            </p>
                          </div>
                        </div>
                        {index < order.pesanan_items.length - 1 && (
                          <Separator className="my-2 bg-gray-100" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <IconPackage className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Tidak ada item</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ringkasan Pembayaran */}
            <Card className="border-0 shadow-lg shadow-gray-200/50 rounded-2xl">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <IconReceipt className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Ringkasan</h3>
                </div>
              </CardHeader>
              <CardContent className="py-6 space-y-4">
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-600">Subtotal Produk</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                
                <Separator className="bg-gray-100" />
                
                <div className="flex items-center justify-between py-3 px-4 bg-orange-50 rounded-xl">
                  <span className="text-base font-semibold text-orange-900">Total</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatCurrency(order.total_harga)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
