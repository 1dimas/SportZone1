"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { VarianForm } from "@/components/petugas/varian-form"
import { getVarianById } from "@/components/lib/services/varian.service"

export default function VarianEditPage() {
  const params = useParams()
  const router = useRouter()
  const [varian, setVarian] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchVarian = async () => {
      try {
        const data = await getVarianById(params.varianId as string)
        setVarian(data)
      } catch (error) {
        toast.error("Gagal memuat data varian")
        router.push(`/dashboardpetugas/produk/${params.id}/varian`)
      } finally {
        setLoading(false)
      }
    }

    if (params.varianId) {
      fetchVarian()
    }
  }, [params.varianId, router, params.id])

  const handleSuccess = () => {
    toast.success("Varian berhasil diperbarui")
    router.push(`/dashboardpetugas/produk/${params.id}/varian`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Memuat data varian...</p>
        </div>
      </div>
    )
  }

  if (!varian) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Varian tidak ditemukan</h2>
          <p className="text-muted-foreground">Varian yang Anda cari tidak tersedia.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push(`/dashboardpetugas/produk/${params.id}/varian`)}
          >
            Kembali ke daftar varian
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push(`/dashboardpetugas/produk/${params.id}/varian`)}
          className="h-8 w-8"
        >
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">Edit Varian</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <VarianForm produkId={params.id as string} varian={varian} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
