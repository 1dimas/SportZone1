"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Package,
  Image as ImageIcon,
  Plus,
  Trash,
  Layers,
  Tag,
  Clock,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  getProdukById,
  getVarianByProduk,
} from "@/components/lib/services/produk.service";
import { deleteVarian } from "@/components/lib/services/varian.service";

interface ProdukDetail {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  status: string;
  gambar?: string[];
  subkategori?: {
    id: string;
    nama: string;
    kategoriOlahraga?: {
      id: string;
      nama: string;
    };
  };
  brand?: {
    id: string;
    nama: string;
    deskripsi?: string;
    logo?: string;
  };
  varian?: any[];
  created_at: string;
  updated_at: string;
}

export default function ProdukDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [produk, setProduk] = React.useState<ProdukDetail | null>(null);
  const [varian, setVarian] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkData, varianData] = await Promise.all([
          getProdukById(params.id as string),
          getVarianByProduk(params.id as string),
        ]);
        setProduk(produkData);
        setVarian(varianData);
        if (produkData.gambar && produkData.gambar.length > 0) {
          setSelectedImage(produkData.gambar[0]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Gagal memuat detail produk");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-700 border-green-200";
      case "nonaktif":
        return "bg-red-100 text-red-700 border-red-200";
      case "stok habis":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleDeleteVarian = async (varianId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus varian ini?")) {
      return;
    }

    try {
      await deleteVarian(varianId);
      setVarian((prev) => prev.filter((v) => v.id !== varianId));
      toast.success("Varian berhasil dihapus");
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Gagal menghapus varian");
    }
  };

  // Enhanced Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>

            {/* Info Cards Skeleton */}
            <div className="space-y-6">
              <div className="rounded-2xl border p-6 space-y-4 bg-white">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>

              {/* Statistics Skeleton */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border p-4 bg-white">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full max-w-md rounded-xl" />
            <div className="rounded-2xl border p-6 space-y-4 bg-white">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produk tidak ditemukan
          </h1>
          <p className="text-gray-500 mb-6">
            Produk yang Anda cari tidak tersedia
          </p>
          <Button
            onClick={() => router.push("/dashboardpetugas/produk")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const totalStok =
    varian.length > 0
      ? varian.reduce((sum, v) => sum + (v.stok || 0), 0)
      : produk.stok || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboardpetugas/produk")}
              className="rounded-xl hover:bg-orange-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div>
              <h1 className="font-semibold text-lg text-gray-900 truncate max-w-md">
                {produk.nama}
              </h1>
              <p className="text-xs text-gray-500">Detail Produk</p>
            </div>
            <Badge
              variant="outline"
              className={`ml-2 ${getStatusColor(produk.status)}`}
            >
              {produk.status === "aktif"
                ? "Aktif"
                : produk.status === "nonaktif"
                ? "Nonaktif"
                : "Stok Habis"}
            </Badge>
          </div>
          <Button
            onClick={() =>
              router.push(`/dashboardpetugas/produk/${produk.id}/edit`)
            }
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Produk
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-lg">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={produk.nama}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2 opacity-30" />
                  <span className="text-sm">Tidak ada gambar</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {produk.gambar && produk.gambar.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {produk.gambar.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImage === image
                        ? "border-orange-500 ring-2 ring-orange-200 shadow-md"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${produk.nama} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50 rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Informasi Produk
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Price */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Harga
                  </label>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {formatCurrency(produk.harga)}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Deskripsi
                  </label>
                  <p className="text-gray-700 leading-relaxed">
                    {produk.deskripsi}
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Categories */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-gray-50/80">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Tag className="w-3 h-3" /> Kategori
                    </label>
                    <p className="text-gray-900 font-medium">
                      {produk.subkategori?.kategoriOlahraga?.nama || "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50/80">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Layers className="w-3 h-3" /> Subkategori
                    </label>
                    <p className="text-gray-900 font-medium">
                      {produk.subkategori?.nama || "-"}
                    </p>
                  </div>
                </div>

                {/* Brand */}
                <div className="p-3 rounded-xl bg-gray-50/80">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Brand
                  </label>
                  <div className="flex items-center gap-3">
                    {produk.brand?.logo && (
                      <img
                        src={produk.brand.logo}
                        alt={produk.brand.nama}
                        className="w-10 h-10 rounded-lg object-contain bg-white p-1 border"
                      />
                    )}
                    <span className="text-gray-900 font-medium">
                      {produk.brand?.nama || "-"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gambar
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {produk.gambar?.length || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Varian
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {varian.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stok
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {totalStok}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="varian" className="w-full">
          <TabsList className="bg-gray-100/80 p-1.5 rounded-xl w-full max-w-md">
            <TabsTrigger
              value="varian"
              className="rounded-lg flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
            >
              <Package className="w-4 h-4" />
              Varian Produk
            </TabsTrigger>
            <TabsTrigger
              value="detail"
              className="rounded-lg flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
            >
              <Info className="w-4 h-4" />
              Detail Tambahan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="varian" className="mt-6">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Varian Produk</CardTitle>
                    <CardDescription className="mt-1">
                      Kelola varian produk seperti ukuran, warna, dan stok
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboardpetugas/produk/${produk.id}/varian/create`
                      )
                    }
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 rounded-lg gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Varian
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {varian.length > 0 ? (
                  <div className="space-y-3">
                    {varian.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50/30 hover:shadow-md hover:border-orange-200 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Package className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {item.ukuran && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 text-xs"
                                >
                                  {item.ukuran}
                                </Badge>
                              )}
                              {item.warna && (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-700 text-xs"
                                >
                                  {item.warna}
                                </Badge>
                              )}
                              {!item.ukuran && !item.warna && (
                                <span className="font-medium text-gray-900">
                                  Varian Default
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {item.stok} unit
                            </p>
                            {item.harga && (
                              <p className="text-sm text-orange-600 font-medium">
                                {formatCurrency(item.harga)}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboardpetugas/produk/${produk.id}/varian/${item.id}/edit`
                                )
                              }
                              className="rounded-lg hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVarian(item.id)}
                              className="rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-1">
                      Belum ada varian untuk produk ini
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Tambahkan varian untuk mengatur ukuran, warna, dan stok
                    </p>
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboardpetugas/produk/${produk.id}/varian/create`
                        )
                      }
                      className="bg-orange-500 hover:bg-orange-600 rounded-xl gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Varian Pertama
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detail" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Informasi Waktu
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 rounded-xl bg-gray-50/80">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                      Dibuat
                    </label>
                    <p className="text-gray-900 font-medium">
                      {new Date(produk.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50/80">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                      Terakhir Diupdate
                    </label>
                    <p className="text-gray-900 font-medium">
                      {new Date(produk.updated_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-500" />
                    Ringkasan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600 text-sm">ID Produk</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {produk.id.substring(0, 8)}...
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600 text-sm">Status</span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(produk.status)}
                      >
                        {produk.status}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600 text-sm">Total Gambar</span>
                      <span className="font-medium text-gray-900">
                        {produk.gambar?.length || 0}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600 text-sm">Total Varian</span>
                      <span className="font-medium text-gray-900">
                        {varian.length}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-gray-600 text-sm">Total Stok</span>
                      <span className="font-bold text-orange-600">
                        {totalStok} unit
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
