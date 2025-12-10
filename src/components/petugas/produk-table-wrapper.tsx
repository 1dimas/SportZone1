"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { ProdukTable, produkSchema } from "@/components/petugas/produk-table"
import { getAllProduk } from "@/components/lib/services/produk.service"
import { addProductRefreshListener } from "@/components/lib/utils/product-refresh"

type Produk = z.infer<typeof produkSchema>

export function ProdukTableWrapper() {
  const [produk, setProduk] = React.useState<Produk[]>([])

  const fetchProduk = async () => {
    try {
      const data = await getAllProduk()
      setProduk(data)
    } catch (error: any) {
      console.error("Error fetching products:", error)
      toast.error(error.message || "Gagal memuat data produk")
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

  return (
    <>
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
          className="gap-2 px-4 bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <ProdukTable data={produk} />
      </div>
    </>
  )
}
