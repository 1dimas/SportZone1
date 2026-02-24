"use client"

import { Suspense } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { ProdukTableReadonly } from "@/components/admin/produk-table-readonly"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportProdukToExcel } from "@/components/lib/services/produk.service"
import { toast } from "sonner"

export default function ProdukPage() {
  const handleExportExcel = async () => {
    try {
      await exportProdukToExcel()
      toast.success("Data berhasil diexport ke Excel")
    } catch (error: any) {
      console.error("Error exporting to Excel:", error)
      toast.error(error?.message || "Gagal mengexport data ke Excel")
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Daftar Produk</h1>
                  <p className="text-muted-foreground">
                    Lihat daftar produk dan variannya.
                  </p>
                </div>
                <Button
                  onClick={handleExportExcel}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Excel
                </Button>
              </div>
              <div className="px-4 lg:px-6">
                <Suspense fallback={<TableSkeleton />}>
                  <ProdukTableReadonly />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
