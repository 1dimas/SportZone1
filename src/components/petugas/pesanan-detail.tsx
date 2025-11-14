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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!pesanan) {
    return (
      <div className="text-center text-red-600">Pesanan tidak ditemukan</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Detail Pesanan</h2>
      <div className="mb-4">
        <strong>ID Pesanan:</strong> {pesanan.id}
      </div>
      <div className="mb-4">
        <strong>Pelanggan:</strong> {pesanan.user?.username} (
        {pesanan.user?.email})
      </div>
      <div className="mb-4">
        <strong>Tanggal Pesanan:</strong>{" "}
        {new Date(pesanan.tanggal_pesanan).toLocaleString()}
      </div>
      <div className="mb-4">
        <strong>Alamat Pengiriman:</strong> {pesanan.alamat_pengiriman}
      </div>
      <div className="mb-4">
        <strong>Total Harga:</strong> Rp{" "}
        {pesanan.total_harga.toLocaleString("id-ID")}
      </div>
      <Separator />
      <div className="my-4">
        <h3 className="text-lg font-semibold mb-2">Item Pesanan</h3>
        <ul className="list-disc list-inside">
          {pesanan.pesanan_items?.map((item) => (
            <li key={item.id}>
              {item.produk?.nama || "Produk"} - {item.kuantitas} x Rp{" "}
              {item.harga_satuan.toLocaleString("id-ID")}
              {item.produk_varian
                ? ` (${item.produk_varian.warna_varian} - ${item.produk_varian.ukuran})`
                : ""}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="my-4">
        <Label>Status Pesanan</Label>
        <Select
          value={selectedStatus}
          onValueChange={handleStatusChange}
          disabled={updating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="diproses">Diproses</SelectItem>
            <SelectItem value="dikirim">Dikirim</SelectItem>
            <SelectItem value="selesai">Selesai</SelectItem>
            <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
            <SelectItem value="dikembalikan">Dikembalikan</SelectItem>
          </SelectContent>
        </Select>
        {(pesanan.status === 'dikirim' || pesanan.status === 'selesai') && selectedStatus === 'dikembalikan' && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ Mengubah status ke &quot;Dikembalikan&quot; akan mengembalikan stok produk.
          </p>
        )}
        {pesanan.status !== 'dikirim' && pesanan.status !== 'selesai' && selectedStatus === 'dikembalikan' && (
          <p className="text-sm text-red-600 mt-2">
            ⚠️ Status &quot;Dikembalikan&quot; hanya dapat digunakan untuk pesanan dengan status &quot;Dikirim&quot; atau &quot;Selesai&quot;.
          </p>
        )}
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={updating}
        >
          Kembali
        </Button>
        <Button
          onClick={handleUpdateStatus}
          disabled={updating || selectedStatus === pesanan.status}
        >
          {updating ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}
