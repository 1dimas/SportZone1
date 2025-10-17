"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
        toast.error("Gagal memuat data produk ❌")
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

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm">Memuat data produk...</p>
        </div>
      </div>
    )
  }

  if (!produk) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold">Produk tidak ditemukan</h2>
          <p className="text-muted-foreground text-sm">
            Produk yang Anda cari mungkin sudah dihapus atau tidak tersedia.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/dashboardpetugas/produk")}
          >
            Kembali ke Daftar Produk
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboardpetugas/produk")}
            className="h-9 w-9 rounded-lg border-muted-foreground/20 hover:bg-muted"
          >
            <IconArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Edit Produk
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ubah detail produk sesuai kebutuhan Anda.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Form */}
      <Card className="p-8 shadow-sm border border-border/50 bg-card rounded-2xl hover:shadow-md transition-all duration-200">
        <ProdukForm produk={produk} onSuccess={handleSuccess} />
      </Card>

      {/* Footer info */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        Pastikan semua perubahan sudah benar sebelum menyimpan.
      </p>
    </div>
  )
}
