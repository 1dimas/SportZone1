"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { VarianForm } from "@/components/petugas/varian-form"

export default function VarianCreatePage() {
  const params = useParams()
  const router = useRouter()

  const handleSuccess = () => {
    toast.success("Varian berhasil dibuat")
    router.push(`/dashboardpetugas/produk/${params.id}/varian`)
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
        <h1 className="text-2xl font-bold md:text-3xl">Tambah Varian Baru</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <VarianForm produkId={params.id as string} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
