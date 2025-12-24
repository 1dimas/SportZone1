"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Package } from "lucide-react"

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

export default function ProdukCreatePage() {
  const router = useRouter()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    // Small delay to show loading state
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSuccess = () => {
    toast.success("Produk berhasil dibuat 🎉")
    localStorage.setItem("refreshProducts", "true")
    router.push("/dashboardpetugas/produk")
  }

  // Loading skeleton
  if (!isReady) {
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
            onClick={() => router.push("/dashboardpetugas/produk")}
            className="rounded-xl hover:bg-orange-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <h1 className="font-semibold text-lg text-gray-900">Tambah Produk Baru</h1>
            <p className="text-xs text-gray-500">Lengkapi data produk</p>
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
                <CardTitle className="text-lg">Informasi Produk</CardTitle>
                <CardDescription>Isi data produk dengan lengkap dan benar</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ProdukForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 pt-6">
          Pastikan semua data sudah benar sebelum menyimpan produk.
        </p>
      </div>
    </div>
  )
}
