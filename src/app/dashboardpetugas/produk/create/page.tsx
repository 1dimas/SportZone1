"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ProdukForm } from "@/components/petugas/produk-form"

export default function ProdukCreatePage() {
  const router = useRouter()

  const handleSuccess = () => {
    toast.success("Produk berhasil dibuat")
    localStorage.setItem('refreshProducts', 'true')
    router.push("/dashboardpetugas/produk")
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
        <h1 className="text-2xl font-bold md:text-3xl">Tambah Produk Baru</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <ProdukForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
