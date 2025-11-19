"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import { getPesananById, Pesanan } from "@/components/lib/services/pesanan.service";
import { createPengembalian, AlasanPengembalian } from "@/components/lib/services/pengembalian.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

export default function FormPengembalianPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [alasan, setAlasan] = useState<AlasanPengembalian>(AlasanPengembalian.RUSAK);
  const [keterangan, setKeterangan] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const data = await getPesananById(id);
        if (mounted) {
          if (data.status !== "dikirim" && data.status !== "selesai") {
            setError("Pengembalian hanya dapat diajukan untuk pesanan dengan status dikirim atau selesai");
            return;
          }
          setOrder(data);
        }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      if (!selectedFile.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (!keterangan.trim()) {
      alert("Silakan isi keterangan pengembalian");
      return;
    }

    try {
      setSubmitting(true);
      await createPengembalian(
        {
          pesanan_id: order.id,
          alasan,
          keterangan: keterangan.trim(),
        },
        file || undefined
      );
      alert("Pengajuan pengembalian berhasil dikirim. Silakan menunggu konfirmasi dari admin.");
      router.push("/pesanan/history");
    } catch (err: any) {
      alert(err?.message || "Gagal mengajukan pengembalian");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <svg className="animate-spin h-8 w-8 text-orange-500 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memuat data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali
      </Button>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Ajukan Pengembalian Pesanan</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Pesanan #{order.id.substring(0, 8)} - {formatCurrency(order.total_harga)}
          </p>
        </CardHeader>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Alasan Pengembalian *</Label>
              <RadioGroup value={alasan} onValueChange={(v) => setAlasan(v as AlasanPengembalian)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AlasanPengembalian.RUSAK} id="rusak" />
                  <Label htmlFor="rusak" className="font-normal cursor-pointer">
                    Barang Rusak
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AlasanPengembalian.SALAH_VARIAN} id="salah-varian" />
                  <Label htmlFor="salah-varian" className="font-normal cursor-pointer">
                    Salah Varian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AlasanPengembalian.TIDAK_SESUAI} id="tidak-sesuai" />
                  <Label htmlFor="tidak-sesuai" className="font-normal cursor-pointer">
                    Tidak Sesuai Deskripsi
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AlasanPengembalian.LAINNYA} id="lainnya" />
                  <Label htmlFor="lainnya" className="font-normal cursor-pointer">
                    Lainnya
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan Detail *</Label>
              <Textarea
                id="keterangan"
                placeholder="Jelaskan secara detail alasan pengembalian..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={5}
                required
              />
              <p className="text-sm text-gray-500">
                Jelaskan kondisi barang dan alasan pengembalian sedetail mungkin
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bukti-foto">Bukti Foto (Opsional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="w-full"
                    >
                      Ganti Foto
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="bukti-foto" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors">
                      <Upload className="w-12 h-12" />
                      <span className="text-sm font-medium">Klik untuk upload foto</span>
                      <span className="text-xs">JPG, PNG (Maks. 5MB)</span>
                    </div>
                    <input
                      type="file"
                      id="bukti-foto"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Catatan:</strong> Pengajuan pengembalian akan diproses oleh admin kami.
                Anda akan mendapatkan notifikasi setelah pengajuan Anda disetujui atau ditolak.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                disabled={submitting}
              >
                {submitting ? "Mengirim..." : "Ajukan Pengembalian"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
