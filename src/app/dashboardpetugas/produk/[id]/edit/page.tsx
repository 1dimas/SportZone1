"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Package, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProdukForm } from "@/components/petugas/produk-form"
import { getProdukById } from "@/components/lib/services/produk.service"

export default function ProdukEditPage() {
  const params = useParams()
  const router = useRouter()
  const [produk, setProduk] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProduk = async () => {
      try {
        const data = await getProdukById(params.id as string)
        setProduk(data)
      } catch (error) {
        toast.error("Gagal memuat data produk")
        router.push("/dashboardpetugas/produk")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchProduk()
  }, [params.id, router])

  const handleSuccess = () => {
    toast.success("Produk berhasil diperbarui ✨")
    localStorage.setItem("refreshProducts", "true")
    router.push("/dashboardpetugas/produk")
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
          <div className="container mx-auto px-6 h-16 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="h-6 w-px bg-gray-200" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 max-w-4xl">
          <div className="rounded-2xl border bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-white border-b p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </div>
            <div className="p-6 space-y-8">
              {/* Section 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
              {/* Section 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              {/* Section 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              {/* Section 4 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
              {/* Button */}
              <div className="flex justify-end pt-4 border-t">
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia
          </p>
          <Button
            onClick={() => router.push("/dashboardpetugas/produk")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Produk
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
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
            <h1 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <Edit className="w-4 h-4 text-orange-500" />
              Edit Produk
            </h1>
            <p className="text-xs text-gray-500 truncate max-w-md">
              {produk.nama}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Edit Informasi Produk</CardTitle>
                <CardDescription>Ubah detail produk sesuai kebutuhan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ProdukForm produk={produk} onSuccess={handleSuccess} />
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 pt-6">
          Pastikan semua perubahan sudah benar sebelum menyimpan.
        </p>
      </div>
    </div>
  )
}
