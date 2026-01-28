"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Package, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { VarianForm } from "@/components/petugas/varian-form"
import { getProdukById } from "@/components/lib/services/produk.service"

export default function VarianCreatePage() {
  const params = useParams()
  const router = useRouter()
  const [hargaProduk, setHargaProduk] = React.useState<number>(0)
  const [produkNama, setProdukNama] = React.useState<string>("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProduk = async () => {
      try {
        const produk = await getProdukById(params.id as string)
        setHargaProduk(produk?.harga || 0)
        setProdukNama(produk?.nama || "")
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Gagal memuat data produk")
      } finally {
        setLoading(false)
      }
    }
    fetchProduk()
  }, [params.id])

  const handleSuccess = () => {
    toast.success("Varian berhasil dibuat")
    window.location.href = `/dashboardpetugas/produk/${params.id}`
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
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 max-w-2xl">
          <div className="rounded-2xl border bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-white border-b p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="p-6 space-y-6">
              {/* Section 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              </div>
              {/* Section 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              </div>
              {/* Button */}
              <div className="flex justify-end pt-4 border-t">
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          </div>
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
            onClick={() => router.push(`/dashboardpetugas/produk/${params.id}`)}
            className="rounded-xl hover:bg-orange-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <h1 className="font-semibold text-lg text-gray-900">Tambah Varian Baru</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Package className="w-3 h-3" />
              {produkNama || "Memuat..."}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Detail Varian</CardTitle>
                <CardDescription>Isi informasi varian produk seperti ukuran, warna, dan stok</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <VarianForm 
              produkId={params.id as string} 
              hargaProduk={hargaProduk} 
              onSuccess={handleSuccess} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
