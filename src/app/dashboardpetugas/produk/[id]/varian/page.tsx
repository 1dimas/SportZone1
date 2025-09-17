"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Plus } from "lucide-react"
import { IconArrowLeft } from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { VarianTable, varianSchema } from "@/components/petugas/varian-table"
import { getVarianByProduk } from "@/components/lib/services/varian.service"

type Varian = z.infer<typeof varianSchema>

export default function VarianPage() {
  const params = useParams()
  const [varian, setVarian] = React.useState<Varian[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchVarian = async () => {
    try {
      const data = await getVarianByProduk(params.id as string)
      setVarian(data)
    } catch (error) {
      toast.error("Gagal memuat data varian")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (params.id) {
      fetchVarian()
    }
  }, [params.id])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => window.location.href = `/dashboardpetugas/produk/${params.id}`}
              className="h-8 w-8"
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Varian Produk</h1>
              <p className="text-muted-foreground">
                Kelola varian untuk produk ini
              </p>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => window.location.href = `/dashboardpetugas/produk/${params.id}/varian/create`}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Varian
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <VarianTable data={varian} produkId={params.id as string} />
      </div>
    </div>
  )
}
