"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { VarianForm } from "@/components/petugas/varian-form"
import { getProdukById } from "@/components/lib/services/produk.service"
import { getVarianById } from "@/components/lib/services/varian.service"

export default function VarianEditPage() {
  const params = useParams()
  const router = useRouter()
  const [hargaProduk, setHargaProduk] = React.useState<number>(0)
  const [varian, setVarian] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [produk, varianData] = await Promise.all([
          getProdukById(params.id as string),
          getVarianById(params.varianId as string)
        ])
        setHargaProduk(produk?.harga || 0)
        setVarian(varianData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id, params.varianId])

  const handleSuccess = () => {
    toast.success("Varian berhasil diperbarui")
    // Use window.location to force a full page reload and refresh the variant data
    window.location.href = `/dashboardpetugas/produk/${params.id}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!varian) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Varian tidak ditemukan</p>
          <Button
            onClick={() => router.push(`/dashboardpetugas/produk/${params.id}`)}
            className="mt-4"
          >
            Kembali
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
          onClick={() => router.push(`/dashboardpetugas/produk/${params.id}`)}
          className="h-8 w-8"
        >
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">Edit Varian</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <VarianForm
          produkId={params.id as string}
          hargaProduk={hargaProduk}
          varian={varian}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
