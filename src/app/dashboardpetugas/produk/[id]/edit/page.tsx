"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ProdukForm } from "@/components/petugas/produk-form"
import { getProdukById } from "@/components/lib/services/produk.service"

export default function ProdukEditPage() {
  const params = useParams()
  const router = useRouter()
  const [produk, setProduk] = React.useState(null)
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

    if (params.id) {
      fetchProduk()
    }
  }, [params.id, router])

  const handleSuccess = () => {
    toast.success("Produk berhasil diperbarui")
    localStorage.setItem('refreshProducts', 'true')
    router.push("/dashboardpetugas/produk")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Memuat produk...</p>
        </div>
      </div>
    )
  }

  if (!produk) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Produk tidak ditemukan</h2>
          <p className="text-muted-foreground">Produk yang Anda cari tidak tersedia.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push("/dashboardpetugas/produk")}
          >
            Kembali ke daftar produk
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
          onClick={() => router.push("/dashboardpetugas/produk")}
          className="h-8 w-8"
        >
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold md:text-3xl">Edit Produk</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <ProdukForm produk={produk} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
