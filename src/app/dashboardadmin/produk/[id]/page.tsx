"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  MoreVertical,
  Copy,
  Box,
  Tag,
  Layers,
  Image as ImageIcon,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  getProdukById,
  getVarianByProduk,
} from "@/components/lib/services/produk.service";

// --- Interfaces ---
interface ProdukDetail {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  status: string;
  gambar?: string[];
  subkategori?: { id: string; nama: string };
  brand?: { id: string; nama: string; logo?: string };
  created_at: string;
  updated_at: string;
}

interface VarianItem {
  id: string;
  ukuran?: string;
  warna?: string;
  stok: number;
  harga?: number;
}

export default function AdminProdukDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [produk, setProduk] = React.useState<ProdukDetail | null>(null);
  const [varian, setVarian] = React.useState<VarianItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const produkId = params.id as string;
        const [produkData, varianData] = await Promise.all([
          getProdukById(produkId),
          getVarianByProduk(produkId),
        ]);
        setProduk(produkData);
        setVarian(varianData);
      } catch (error) {
        toast.error("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Memuat data...
      </div>
    );
  }

  if (!produk) return null;

  // Hitung total stok dari varian (jika ada), atau gunakan stok induk
  const totalStok =
    varian.length > 0
      ? varian.reduce((a, b) => a + b.stok, 0)
      : produk.stok;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 1. HEADER: Judul & Tombol Aksi Standar */}
      <div className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="container max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="-ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-6 border-r mx-2" />
            <h1 className="font-semibold text-lg truncate max-w-md">
              {produk.nama}
            </h1>
            <Badge
              variant="outline"
              className={`font-normal capitalize ${
                produk.status === "aktif"
                  ? "text-green-600 border-green-200 bg-green-50"
                  : "text-gray-500"
              }`}
            >
              {produk.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Edit */}
            {/* <Button variant="default" size="sm" className="px-4 gap-2">
              <Edit className="w-4 h-4" /> Edit
            </Button> */}

            {/* Menu Hapus */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Produk
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 py-8">
        {/* 2. OVERVIEW CARDS (Statistik Utama) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-4 rounded-xl border bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-1">Harga Dasar</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatCurrency(produk.harga)}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-1">Total Stok</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold tracking-tight">
                {totalStok}
              </p>
              <span className="text-sm text-gray-400">Unit</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-gray-50/50 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500">ID Produk</span>
              <Copy
                className="w-3 h-3 text-gray-400 cursor-pointer hover:text-black"
                onClick={() => {
                  navigator.clipboard.writeText(produk.id);
                  toast.success("ID Disalin");
                }}
              />
            </div>
            <p className="font-mono text-sm text-gray-700 truncate">
              {produk.id}
            </p>
          </div>
        </div>

        {/* 3. TABS CONTENT */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="px-6 rounded-md">
              Ringkasan & Foto
            </TabsTrigger>
            <TabsTrigger value="variants" className="px-6 rounded-md">
              Stok & Varian ({varian.length})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Detail & Gambar */}
          <TabsContent
            value="overview"
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="grid md:grid-cols-12 gap-8 mt-6">
              {/* Gambar Produk (Sudah diperbaiki: object-contain) */}
              <div className="md:col-span-4">
                <div className="aspect-square bg-white rounded-xl overflow-hidden border flex items-center justify-center relative shadow-sm">
                  {produk.gambar && produk.gambar.length > 0 ? (
                    <img
                      src={produk.gambar[0]}
                      alt={produk.nama}
                      className="w-full h-full object-contain p-4" // FOTO TIDAK KEPOTONG
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                      <span className="text-xs">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
                {produk.gambar && produk.gambar.length > 1 && (
                  <div className="flex justify-center mt-3">
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                      +{produk.gambar.length - 1} foto lainnya
                    </span>
                  </div>
                )}
              </div>

              {/* Deskripsi & Meta Info */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                    {produk.deskripsi}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Tag className="w-3 h-3" /> Kategori
                    </div>
                    <p className="font-medium">
                      {produk.subkategori?.nama || "-"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Layers className="w-3 h-3" /> Brand
                    </div>
                    <div className="flex items-center gap-2">
                      {produk.brand?.logo && (
                        <img
                          src={produk.brand.logo}
                          className="w-5 h-5 object-contain"
                          alt="brand"
                        />
                      )}
                      <p className="font-medium">
                        {produk.brand?.nama || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Tabel Varian */}
          <TabsContent
            value="variants"
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="border rounded-xl overflow-hidden mt-6">
              {varian.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium text-gray-500">
                        Varian
                      </th>
                      <th className="px-6 py-4 text-right font-medium text-gray-500">
                        Harga
                      </th>
                      <th className="px-6 py-4 text-right font-medium text-gray-500">
                        Stok
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {varian.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.ukuran}{" "}
                          <span className="text-gray-300 mx-1">/</span>{" "}
                          {item.warna}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {item.harga ? formatCurrency(item.harga) : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`${
                              item.stok === 0
                                ? "text-red-500 font-medium"
                                : "text-gray-900"
                            }`}
                          >
                            {item.stok}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <Box className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>Tidak ada varian data.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}