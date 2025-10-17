"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProdukForm } from "@/components/petugas/produk-form"

export default function ProdukCreatePage() {
  const router = useRouter()

  const handleSuccess = () => {
    toast.success("Produk berhasil dibuat 🎉")
    localStorage.setItem("refreshProducts", "true")
    router.push("/dashboardpetugas/produk")
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header Section */}
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
              Tambah Produk Baru
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lengkapi data produk di bawah ini untuk menambahkan produk baru.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Form Section */}
      <Card className="p-8 shadow-sm border border-border/50 bg-card rounded-2xl hover:shadow-md transition-all duration-200">
        <ProdukForm onSuccess={handleSuccess} />
      </Card>

      {/* Footer info */}
      <p className="text-center text-xs text-muted-foreground pt-4">
        Pastikan semua data sudah benar sebelum menyimpan produk.
      </p>
    </div>
  )
}
