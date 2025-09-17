
import { AppSidebar } from "@/components/petugas/app-sidebar"
import { ChartAreaInteractive } from "@/components/petugas/chart-area-interactive"
import { DataTable } from "@/components/petugas/data-table"
import { SectionCards } from "@/components/petugas/section-cards"
import { SiteHeader } from "@/components/petugas/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function PetugasDashboard() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-6 md:py-8">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold md:text-3xl">Dashboard Petugas</h1>
                <p className="text-muted-foreground">Kelola produk dan pesanan Anda</p>
              </div>
              
              <SectionCards />
              
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Statistik Penjualan</h2>
                </div>
                <ChartAreaInteractive />
              </div>
              
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Aktivitas Terbaru</h2>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="font-medium">Pesanan baru #12345</p>
                        <p className="text-sm text-muted-foreground">Rp 500.000 • 2 produk</p>
                      </div>
                      <div className="text-sm text-muted-foreground">2 menit yang lalu</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="font-medium">Produk baru ditambahkan</p>
                        <p className="text-sm text-muted-foreground">Sepatu Lari Nike Air Zoom</p>
                      </div>
                      <div className="text-sm text-muted-foreground">1 jam yang lalu</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="flex-1">
                        <p className="font-medium">Stok menipis</p>
                        <p className="text-sm text-muted-foreground">Bola Basket Spalding TF-1000</p>
                      </div>
                      <div className="text-sm text-muted-foreground">3 jam yang lalu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
