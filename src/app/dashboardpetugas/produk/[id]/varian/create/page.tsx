"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { VarianForm } from "@/components/petugas/varian-form"
import { getProdukById } from "@/components/lib/services/produk.service"

export default function VarianCreatePage() {
  const params = useParams()
  const router = useRouter()
  const [hargaProduk, setHargaProduk] = React.useState<number>(0)

  React.useEffect(() => {
    const fetchProduk = async () => {
      try {
        const produk = await getProdukById(params.id as string)
        setHargaProduk(produk?.harga || 0)
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }
    fetchProduk()
  }, [params.id])

  const handleSuccess = () => {
    toast.success("Varian berhasil dibuat")
    // Use window.location to force a full page reload and refresh the variant data
    window.location.href = `/dashboardpetugas/produk/${params.id}`
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
        <h1 className="text-2xl font-bold md:text-3xl">Tambah Varian Baru</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <VarianForm produkId={params.id as string} hargaProduk={hargaProduk} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
