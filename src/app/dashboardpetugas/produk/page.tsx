"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { ProdukTable, produkSchema } from "@/components/petugas/produk-table"
import { getAllProduk } from "@/components/lib/services/produk.service"
import { addProductRefreshListener } from "@/components/lib/utils/product-refresh"
import { AppSidebar } from "@/components/petugas/app-sidebar"
import { SiteHeader } from "@/components/petugas/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

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

    // Refresh otomatis setelah create/edit
    if (typeof window !== "undefined" && localStorage.getItem("refreshProducts") === "true") {
      localStorage.removeItem("refreshProducts")
      setTimeout(() => fetchProduk(), 100)
    }

    const removeListener = addProductRefreshListener(fetchProduk)
    return removeListener
  }, [])

  // 🔄 State loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Memuat data produk...</p>
        </div>
      </div>
    )
  }

  // ⚠️ Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Terjadi kesalahan</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchProduk}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  // ✅ Layout utama
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        {/* Konten Utama */}
        <div className="space-y-8 px-6 pb-10 pt-4">
          {/* Header Page */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Manajemen Produk
              </h1>
              <p className="text-sm text-muted-foreground">
                Kelola produk dan varian produk di toko Anda
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/dashboardpetugas/produk/create")}
              className="gap-2 px-4"
            >
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Button>
          </div>

          {/* Tabel Produk */}
          <div className="rounded-xl border bg-card p-3 shadow-sm">
            <ProdukTable data={produk} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
