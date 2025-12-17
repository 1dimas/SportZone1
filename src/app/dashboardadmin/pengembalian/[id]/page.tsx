"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/admin/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pengembalian,
  getPengembalianById,
  approvePengembalian,
  rejectPengembalian,
} from "@/components/lib/services/pengembalian.service";
import { ArrowLeft, CheckCircle, XCircle, User, Package, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

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

export default function PengembalianDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pengembalian, setPengembalian] = useState<Pengembalian | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [catatanAdmin, setCatatanAdmin] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPengembalianById(id);
      setPengembalian(data);
    } catch (err: any) {
      setError(err?.message || "Gagal mengambil detail pengembalian");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!pengembalian) return;
    if (!confirm("Apakah Anda yakin ingin menyetujui pengembalian ini?")) return;

    try {
      setProcessing(true);
      await approvePengembalian(pengembalian.id, catatanAdmin.trim() || undefined);
      toast.success("Pengembalian berhasil disetujui");
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menyetujui pengembalian");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!pengembalian) return;
    if (!catatanAdmin.trim()) {
      toast.warning("Silakan isi catatan penolakan");
      return;
    }
    if (!confirm("Apakah Anda yakin ingin menolak pengembalian ini?")) return;

    try {
      setProcessing(true);
      await rejectPengembalian(pengembalian.id, catatanAdmin.trim());
      toast.success("Pengembalian berhasil ditolak");
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Gagal menolak pengembalian");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboardadmin/pengembalian")}
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Daftar
                </Button>

                {loading && (
                  <div className="flex items-center justify-center h-64">
                    <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24">
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

                {pengembalian && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <CardTitle>Detail Pengembalian</CardTitle>
                          <Badge className={getStatusColor(pengembalian.status)}>
                            {pengembalian.status === "pending" && "Menunggu"}
                            {pengembalian.status === "approved" && "Disetujui"}
                            {pengembalian.status === "rejected" && "Ditolak"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-500 text-sm">ID Pengembalian</Label>
                            <p className="font-mono text-sm mt-1">{pengembalian.id}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-sm">ID Pesanan</Label>
                            <p className="font-mono text-sm mt-1">{pengembalian.pesanan_id}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-sm">Tanggal Ajuan</Label>
                            <p className="text-sm mt-1">{formatDate(pengembalian.created_at.toString())}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-sm">Alasan</Label>
                            <p className="text-sm mt-1 capitalize">{pengembalian.alasan}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <Label className="text-gray-500 text-sm">Keterangan Customer</Label>
                          <p className="text-sm mt-2 whitespace-pre-line border rounded-lg p-3 bg-gray-50">
                            {pengembalian.keterangan || "-"}
                          </p>
                        </div>

                        {pengembalian.bukti_foto && (
                          <div>
                            <Label className="text-gray-500 text-sm">Bukti Foto</Label>
                            <img
                              src={pengembalian.bukti_foto}
                              alt="Bukti pengembalian"
                              className="mt-2 max-h-96 rounded-lg border"
                            />
                          </div>
                        )}

                        {pengembalian.processed_at && (
                          <>
                            <Separator />
                            <div>
                              <Label className="text-gray-500 text-sm">Diproses Pada</Label>
                              <p className="text-sm mt-1">{formatDate(pengembalian.processed_at.toString())}</p>
                            </div>
                            {pengembalian.catatan_admin && (
                              <div>
                                <Label className="text-gray-500 text-sm">Catatan Admin</Label>
                                <p className="text-sm mt-2 whitespace-pre-line border rounded-lg p-3 bg-blue-50">
                                  {pengembalian.catatan_admin}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card>
                        <CardHeader className="border-b">
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Informasi Customer
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4 space-y-2">
                          <div>
                            <Label className="text-gray-500 text-sm">Nama</Label>
                            <p className="text-sm mt-1">{pengembalian.user?.username || "N/A"}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-sm">Email</Label>
                            <p className="text-sm mt-1">{pengembalian.user?.email || "N/A"}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="border-b">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Detail Pesanan
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4 space-y-4">
                          <div>
                            <Label className="text-gray-500 text-sm">Total Pesanan</Label>
                            <p className="font-semibold text-lg mt-1">
                              {pengembalian.pesanan?.total_harga
                                ? formatCurrency(pengembalian.pesanan.total_harga)
                                : "-"}
                            </p>
                          </div>
                          {pengembalian.pesanan?.pesanan_items && (
                            <div>
                              <Label className="text-gray-500 text-sm mb-2 block">Item Pesanan</Label>
                              <div className="space-y-2">
                                {pengembalian.pesanan.pesanan_items.map((item: any) => (
                                  <div key={item.id} className="text-sm border rounded p-2">
                                    <p className="font-medium">{item.produk?.nama || "Produk"}</p>
                                    <p className="text-gray-600">
                                      {item.kuantitas}x {formatCurrency(item.harga_satuan)}
                                      {item.produk_varian && (
                                        <span className="ml-1">
                                          ({[item.produk_varian.warna, item.produk_varian.ukuran].filter(Boolean).join(" / ")})
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {pengembalian.status === "pending" && (
                        <Card>
                          <CardHeader className="border-b">
                            <CardTitle>Proses Pengembalian</CardTitle>
                          </CardHeader>
                          <CardContent className="py-4 space-y-4">
                            <div>
                              <Label htmlFor="catatan">Catatan Admin</Label>
                              <Textarea
                                id="catatan"
                                placeholder="Tambahkan catatan (wajib untuk penolakan)"
                                value={catatanAdmin}
                                onChange={(e) => setCatatanAdmin(e.target.value)}
                                rows={4}
                                className="mt-2"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                onClick={handleApprove}
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Setujui Pengembalian
                              </Button>
                              <Button
                                onClick={handleReject}
                                disabled={processing}
                                variant="destructive"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Tolak Pengembalian
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
