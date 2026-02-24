"use client"

import { Suspense } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { PesananTableReadonly } from "@/components/admin/pesanan-table-readonly"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportOrderToExcel } from "@/components/lib/services/order.service"
import { toast } from "sonner"

export default function PesananPage() {
  const handleExportExcel = async () => {
    try {
      await exportOrderToExcel()
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
                  <h1 className="text-2xl font-bold">Daftar Pesanan</h1>
                  <p className="text-muted-foreground">
                    Lihat daftar pesanan dan statusnya.
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
                  <PesananTableReadonly />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
