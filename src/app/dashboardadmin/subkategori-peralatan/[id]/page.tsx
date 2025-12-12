"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  MoreVertical,
  Copy,
  Tag,
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

import { getSubkategoriPeralatanById } from "@/components/lib/services/subkategori-peralatan.service";

// --- Interfaces ---
interface KategoriOlahraga {
  id: string;
  nama: string;
  created_at: string;
  updated_at: string;
}

interface SubkategoriPeralatanDetail {
  id: string;
  nama: string;
  kategori_olahraga_id: string;
  created_at: string;
  updated_at: string;
  kategoriOlahraga: KategoriOlahraga;
}

export default function AdminSubkategoriPeralatanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [subkategori, setSubkategori] = React.useState<SubkategoriPeralatanDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const subkategoriId = params.id as string;
        const subkategoriData = await getSubkategoriPeralatanById(subkategoriId);
        setSubkategori(subkategoriData);
      } catch (error) {
        toast.error("Gagal memuat data subkategori peralatan");
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

  if (!subkategori) return null;

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
              {subkategori.nama}
            </h1>
            <Badge variant="outline" className="font-normal">
              Subkategori Peralatan
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Edit */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/dashboardadmin/subkategori-peralatan/${subkategori.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            
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
                  Hapus Subkategori
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
            <p className="text-sm text-gray-500 mb-1">ID Subkategori</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-gray-700 truncate">
                {subkategori.id}
              </p>
              <Copy
                className="w-3 h-3 text-gray-400 cursor-pointer hover:text-black flex-shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(subkategori.id);
                  toast.success("ID Disalin");
                }}
              />
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-1">Tanggal Dibuat</p>
            <p className="text-sm font-medium">
              {new Date(subkategori.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* 3. DETAIL CONTENT */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-lg">
                  Informasi Subkategori Peralatan
                </h3>
                <p className="text-sm text-gray-500">
                  Detail subkategori peralatan
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <FileText className="w-3 h-3" /> Nama Subkategori
                </div>
                <p className="font-medium text-xl text-gray-900">
                  {subkategori.nama}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <FileText className="w-3 h-3" /> Kategori Olahraga
                </div>
                <p className="font-medium text-gray-900">
                  {subkategori.kategoriOlahraga?.nama || 'Tidak diketahui'}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" /> Dibuat
                  </div>
                  <p className="font-medium">
                    {new Date(subkategori.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-3 h-3" /> Terakhir Diubah
                  </div>
                  <p className="font-medium">
                    {new Date(subkategori.updated_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}