"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getPengembalianByUser, Pengembalian } from "@/components/lib/services/pengembalian.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function RiwayatPengembalianPage() {
  const router = useRouter();
  const [pengembalianList, setPengembalianList] = useState<Pengembalian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPengembalianByUser();
        if (mounted) setPengembalianList(data);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Gagal mengambil riwayat pengembalian");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/pesanan/history")}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Riwayat Pesanan
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Riwayat Pengembalian
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Lihat status pengajuan pengembalian Anda.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48">
            <svg className="animate-spin h-8 w-8 text-orange-500 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && pengembalianList.length === 0 && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
            <p className="font-bold">Belum ada pengembalian</p>
            <p>Anda belum pernah mengajukan pengembalian produk.</p>
          </div>
        )}

        {!loading && !error && pengembalianList.length > 0 && (
          <div className="space-y-5">
            {pengembalianList.map((pengembalian) => (
              <Card key={pengembalian.id} className="overflow-hidden bg-white shadow-sm hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(pengembalian.status)}>
                      {pengembalian.status === "pending" && "Menunggu"}
                      {pengembalian.status === "approved" && "Disetujui"}
                      {pengembalian.status === "rejected" && "Ditolak"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {formatDate(pengembalian.created_at.toString())}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-gray-500">
                    #{pengembalian.id.substring(0, 8)}
                  </span>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ID Pesanan:</span>
                      <Link 
                        href={`/pesanan/${pengembalian.pesanan_id}`}
                        className="text-sm font-mono text-orange-600 hover:underline"
                      >
                        {pengembalian.pesanan_id.substring(0, 8)}...
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Alasan:</span>
                      <span className="text-sm capitalize">{pengembalian.alasan}</span>
                    </div>
                    {pengembalian.pesanan?.total_harga && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Pesanan:</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency(pengembalian.pesanan.total_harga)}
                        </span>
                      </div>
                    )}
                    {pengembalian.keterangan && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-gray-600 block mb-1">Keterangan:</span>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {pengembalian.keterangan}
                        </p>
                      </div>
                    )}
                    {pengembalian.catatan_admin && (
                      <div className="pt-2 border-t bg-blue-50 rounded p-2 -mx-2">
                        <span className="text-sm font-medium text-blue-900 block mb-1">
                          Catatan Admin:
                        </span>
                        <p className="text-sm text-blue-800">{pengembalian.catatan_admin}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
