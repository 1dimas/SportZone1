"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  MoreVertical,
  Copy,
  Image as ImageIcon,
  Edit,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getBrandById } from "@/components/lib/services/brand.service";

// --- Interfaces ---
interface BrandDetail {
  id: string;
  nama: string;
  deskripsi: string | null;
  logo: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminBrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [brand, setBrand] = React.useState<BrandDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const brandId = params.id as string;
        const brandData = await getBrandById(brandId);
        setBrand(brandData);
      } catch (error) {
        toast.error("Gagal memuat data brand");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Memuat data...
      </div>
    );
  }

  if (!brand) return null;

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
              {brand.nama}
            </h1>
            <Badge variant="outline" className="font-normal">
              Brand
            </Badge>
          </div>

          <div className="flex items-center gap-2">
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
                  Hapus Brand
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-6 py-8">
        {/* 2. OVERVIEW CARDS (Statistik Utama) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-4 rounded-xl border bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-1">ID Brand</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-gray-700 truncate">
                {brand.id}
              </p>
              <Copy
                className="w-3 h-3 text-gray-400 cursor-pointer hover:text-black flex-shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(brand.id);
                  toast.success("ID Disalin");
                }}
              />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-1">Tanggal Dibuat</p>
            <p className="text-sm font-medium">
              {new Date(brand.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* 3. DETAIL CONTENT */}
        <div className="grid md:grid-cols-12 gap-8">
          {/* Logo Brand */}
          <div className="md:col-span-4">
            <div className="aspect-square bg-white rounded-xl overflow-hidden border flex items-center justify-center relative shadow-sm">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.nama}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-20" />
                  <span className="text-xs">Tidak ada logo</span>
                </div>
              )}
            </div>
          </div>

          {/* Informasi Brand */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Informasi Brand
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="w-3 h-3" /> Nama Brand
                  </div>
                  <p className="font-medium text-lg">{brand.nama}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="w-3 h-3" /> Deskripsi
                  </div>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                    {brand.deskripsi || "Tidak ada deskripsi"}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" /> Dibuat
                    </div>
                    <p className="font-medium">
                      {new Date(brand.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" /> Diubah
                    </div>
                    <p className="font-medium">
                      {new Date(brand.updated_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
