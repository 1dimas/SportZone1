"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pesanan,
  getPesananById,
  updatePesananStatus,
  StatusPesanan,
} from "@/components/lib/services/pesanan.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertCircle,
  User,
  Mail,
  Calendar
} from "lucide-react";

interface PesananDetailProps {
  id: string;
}

export function PesananDetail({ id }: PesananDetailProps) {
  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const router = useRouter();

  const fetchPesanan = async () => {
    try {
      setLoading(true);
      const data = await getPesananById(id);
      setPesanan(data);
      setSelectedStatus(data.status);
    } catch (err) {
      console.error("Failed to fetch pesanan detail:", err);
      toast.error("Gagal memuat detail pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  const handleUpdateStatus = async () => {
    if (!pesanan) return;
    try {
      setUpdating(true);
      await updatePesananStatus(pesanan.id, selectedStatus as StatusPesanan);
      toast.success("Status pesanan berhasil diperbarui");
      fetchPesanan();
    } catch (err) {
      console.error("Failed to update status:", err);
      const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui status pesanan";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Menunggu",
      diproses: "Diproses",
      dikirim: "Dikirim",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
      dikembalikan: "Dikembalikan",
    };
    return labels[status] || status;
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: { bg: "bg-amber-50", text: "text-amber-600", icon: <Clock className="w-3.5 h-3.5" /> },
      diproses: { bg: "bg-blue-50", text: "text-blue-600", icon: <RotateCcw className="w-3.5 h-3.5" /> },
      dikirim: { bg: "bg-violet-50", text: "text-violet-600", icon: <Truck className="w-3.5 h-3.5" /> },
      selesai: { bg: "bg-emerald-50", text: "text-emerald-600", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      dibatalkan: { bg: "bg-red-50", text: "text-red-600", icon: <XCircle className="w-3.5 h-3.5" /> },
      dikembalikan: { bg: "bg-slate-100", text: "text-slate-600", icon: <RotateCcw className="w-3.5 h-3.5" /> },
    };
    return styles[status] || { bg: "bg-gray-50", text: "text-gray-600", icon: null };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-500"></div>
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    );
  }

  const statusStyle = getStatusStyle(pesanan.status);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button> */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">
                Pesanan #{pesanan.id.slice(0, 8)}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                {statusStyle.icon}
                {getStatusLabel(pesanan.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(pesanan.tanggal_pesanan).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pelanggan</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium">
                {pesanan.user?.username?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-medium text-gray-900">{pesanan.user?.username || "-"}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {pesanan.user?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pengiriman</h2>
            </div>
            <p className="text-gray-900 leading-relaxed">{pesanan.alamat_pengiriman}</p>
            {(pesanan.kota || pesanan.provinsi) && (
              <p className="text-sm text-gray-500 mt-1">
                {[pesanan.kota, pesanan.provinsi].filter(Boolean).join(", ")}
              </p>
            )}
            {pesanan.eta_min && pesanan.eta_max && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Estimasi:</span>
                <span className="font-medium text-gray-900">
                  {pesanan.eta_min === pesanan.eta_max
                    ? `${pesanan.eta_min} hari`
                    : `${pesanan.eta_min}-${pesanan.eta_max} hari`}
                </span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Item Pesanan</h2>
                <span className="ml-auto text-xs text-gray-400">{pesanan.pesanan_items?.length || 0} item</span>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {pesanan.pesanan_items?.map((item) => {
                // Generate color from product name for variety
                const productName = item.produk?.nama || "Produk";
                const firstLetter = productName.charAt(0).toUpperCase();

                // Simple hash function to generate consistent color from name
                const hashCode = productName.split('').reduce((acc, char) => {
                  return char.charCodeAt(0) + ((acc << 5) - acc);
                }, 0);

                const colors = [
                  'from-orange-400 to-amber-500',
                  'from-blue-400 to-cyan-500',
                  'from-purple-400 to-pink-500',
                  'from-green-400 to-emerald-500',
                  'from-red-400 to-rose-500',
                  'from-indigo-400 to-violet-500',
                  'from-yellow-400 to-orange-500',
                  'from-teal-400 to-green-500',
                ];

                const colorIndex = Math.abs(hashCode) % colors.length;
                const gradientClass = colors[colorIndex];

                return (
                  <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center border border-white shadow-sm`}>
                      <span className="text-white font-bold text-xl">
                        {firstLetter}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{productName}</p>
                      {item.produk_varian && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.produk_varian.warna} • {item.produk_varian.ukuran}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{item.kuantitas} × Rp {item.harga_satuan.toLocaleString("id-ID")}</p>
                      <p className="font-medium text-gray-900">Rp {(item.kuantitas * item.harga_satuan).toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 flex items-center justify-between">
              <span className="font-medium text-gray-700">Total</span>
              <span className="text-lg font-semibold text-orange-600">Rp {pesanan.total_harga.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Perbarui Status</h2>

            <Select
              value={selectedStatus}
              onValueChange={handleStatusChange}
              disabled={updating}
            >
              <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="diproses">Diproses</SelectItem>
                <SelectItem value="dikirim">Dikirim</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                <SelectItem value="dikembalikan">Dikembalikan</SelectItem>
              </SelectContent>
            </Select>

            {(pesanan.status === 'dikirim' || pesanan.status === 'selesai') && selectedStatus === 'dikembalikan' && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg text-xs text-amber-700">
                Stok produk akan dikembalikan ke inventaris.
              </div>
            )}

            {pesanan.status !== 'dikirim' && pesanan.status !== 'selesai' && selectedStatus === 'dikembalikan' && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg text-xs text-red-700">
                Hanya pesanan yang sudah dikirim atau selesai yang bisa dikembalikan.
              </div>
            )}

            <Button
              className="w-full mt-4 h-11 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === pesanan.status}
            >
              {updating ? "Menyimpan..." : "Simpan"}
            </Button>

            <Button
              variant="outline"
              className="w-full mt-2 border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => router.back()}
              disabled={updating}
            >
              Kembali
            </Button>
          </div>

          {/* Order Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Informasi Pesanan</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-900 font-mono text-xs">{pesanan.id.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID Pesanan</span>
                <span className="text-gray-900 font-mono text-xs">{pesanan.id.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal</span>
                <span className="text-gray-900">
                  {new Date(pesanan.tanggal_pesanan).toLocaleDateString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Waktu</span>
                <span className="text-gray-900">
                  {new Date(pesanan.tanggal_pesanan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}