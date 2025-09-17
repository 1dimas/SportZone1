"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { IconRefreshDot } from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { ProdukTable, produkSchema } from "@/components/petugas/produk-table"
import { getAllProduk } from "@/components/lib/services/produk.service"
import { addProductRefreshListener } from "@/components/lib/utils/product-refresh"

type Produk = z.infer<typeof produkSchema>

export default function ProdukPage() {
  const [produk, setProduk] = React.useState<Produk[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchProduk = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProduk()
      setProduk(data)
    } catch (error: any) {
      console.error("Error fetching products:", error)
      setError(error.message || "Gagal memuat data produk")
      toast.error(error.message || "Gagal memuat data produk")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProduk()

    // Check if refresh is needed from localStorage (for create/edit redirects)
    if (typeof window !== 'undefined' && localStorage.getItem('refreshProducts') === 'true') {
      localStorage.removeItem('refreshProducts')
      // Fetch again after initial load
      setTimeout(() => fetchProduk(), 100)
    }

    // Listen for product refresh events
    const removeListener = addProductRefreshListener(fetchProduk)
    return removeListener
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Memuat data produk...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Terjadi kesalahan</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchProduk}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Manajemen Produk</h1>
          <p className="text-muted-foreground">
            Kelola produk dan varian produk di toko Anda
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchProduk}
            className="gap-2"
          >
            <IconRefreshDot className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            onClick={() => window.location.href = "/dashboardpetugas/produk/create"}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-1">
        <ProdukTable data={produk} />
      </div>
    </div>
  )
}
