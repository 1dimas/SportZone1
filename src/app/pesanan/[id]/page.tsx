"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pesanan, getPesananById } from "@/components/lib/services/pesanan.service";
import { IconCheck, IconTruck, IconClock, IconHome, IconX } from "@tabler/icons-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });

const STATUS_FLOW = ["pending", "diproses", "dikirim", "selesai"] as const;
type StatusKey = typeof STATUS_FLOW[number] | "dibatalkan";

function StatusTimeline({ status }: { status: StatusKey }) {
  const currentIndex = STATUS_FLOW.indexOf(status as any);
  const cancelled = status === "dibatalkan";

  const items = [
    { key: "pending", label: "Pending", icon: IconClock },
    { key: "diproses", label: "Diproses", icon: IconCheck },
    { key: "dikirim", label: "Dikirim", icon: IconTruck },
    { key: "selesai", label: "Selesai", icon: IconCheck },
  ] as const;

  return (
    <div className="flex items-center gap-4">
      {cancelled ? (
        <div className="flex items-center gap-2 text-red-600">
          <IconX className="size-5" />
          <span className="font-medium">Dibatalkan</span>
        </div>
      ) : (
        items.map((item, idx) => {
          const Icon = item.icon;
          const done = currentIndex >= idx;
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span
                className={
                  done
                    ? "bg-orange-600 text-white rounded-full p-1"
                    : "bg-gray-200 text-gray-600 rounded-full p-1"
                }
                aria-label={item.label}
              >
                <Icon className="size-4" />
              </span>
              <span className={done ? "text-orange-700 font-medium" : "text-gray-600"}>{item.label}</span>
              {idx < items.length - 1 && <Separator className="mx-2 w-10" />}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function PesananDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Pesanan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        const data = await getPesananById(id);
        if (mounted) setOrder(data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Detail Pesanan</h1>
          <p className="text-sm text-gray-600 mt-1">Ringkasan, status, dan item pesanan Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/pesanan/history")}>Kembali ke Riwayat</Button>
          {order && (
            <Button variant="ghost" onClick={() => navigator.clipboard.writeText(order.id)}>Copy ID</Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      )}

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

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary & Status */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-700">{order.id}</span>
                <Badge variant="outline" className="capitalize">{order.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500 mr-2">Tanggal</span>
                  <span className="font-medium">{formatDate(order.tanggal_pesanan)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 mr-2">Total</span>
                  <span className="font-medium">{formatCurrency(order.total_harga)}</span>
                </div>
              </div>
              <StatusTimeline status={order.status as StatusKey} />
            </CardContent>
          </Card>

          {/* Pengiriman */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <IconHome className="size-4" />
                Alamat Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-gray-700 whitespace-pre-line">{order.alamat_pengiriman}</p>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>Item Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              {order.pesanan_items && order.pesanan_items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead>Varian</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.pesanan_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.produk?.nama || "Produk"}</TableCell>
                        <TableCell className="text-gray-600">
                          {item.produk_varian
                            ? ([
                                item.produk_varian.warna_varian,
                                item.produk_varian.ukuran,
                              ]
                                .filter((v) => v && String(v).trim().length > 0)
                                .join(" / ") || "-")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(item.harga_satuan))}</TableCell>
                        <TableCell className="text-center">{item.kuantitas}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(item.harga_satuan) * item.kuantitas)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-sm text-gray-600">Tidak ada item untuk pesanan ini.</div>
              )}
            </CardContent>
            <CardFooter className="border-t">
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-semibold">{formatCurrency(subtotal)}</div>
              </div>
            </CardFooter>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {/* Tambahkan biaya ongkir/discount jika tersedia di masa depan */}
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Dibayar</span>
                <span className="font-semibold">{formatCurrency(order.total_harga)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
