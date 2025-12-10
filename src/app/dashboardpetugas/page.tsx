import { Suspense } from "react"
import { AppSidebar } from "@/components/petugas/app-sidebar"
import { ChartAreaInteractive } from "@/components/petugas/chart-area-interactive"
import { OrderListTable } from "@/components/petugas/order-list-table"
import { SectionCards } from "@/components/petugas/section-cards"
import { SiteHeader } from "@/components/petugas/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SectionCardsSkeleton } from "@/components/shared/section-cards-skeleton"
import { ChartSkeleton } from "@/components/shared/chart-skeleton"
import { TableSkeleton } from "@/components/shared/table-skeleton"

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
      <AppSidebar />
      <SidebarInset className="overflow-auto h-screen bg-white transition-all duration-200">
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-orange-50/30">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 pt-4 pb-4 md:gap-6 md:pt-4 md:pb-6">
              <Suspense fallback={<SectionCardsSkeleton />}>
                <SectionCards />
              </Suspense>
              <div className="px-4 lg:px-6">
                <Suspense fallback={<ChartSkeleton />}>
                  <ChartAreaInteractive />
                </Suspense>
              </div>
              <Suspense fallback={<TableSkeleton />}>
                <OrderListTable />
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
