import { Suspense } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { LaporanProdukTable } from "@/components/admin/laporan-produk-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TableSkeleton } from "@/components/shared/table-skeleton"
import { FileText } from "lucide-react"

export default function LaporanProdukPage() {
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
      <SidebarInset className="bg-gradient-to-b from-orange-50/30 to-white">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header Section */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Produk</h1>
                    <p className="text-gray-500 text-sm">
                      Laporan lengkap semua produk dengan statistik stok dan penjualan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="px-4 lg:px-6">
                <Suspense fallback={<TableSkeleton />}>
                  <LaporanProdukTable />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
