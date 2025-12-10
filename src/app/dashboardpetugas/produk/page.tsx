"use client"

import { Suspense } from "react"
import { AppSidebar } from "@/components/petugas/app-sidebar"
import { SiteHeader } from "@/components/petugas/site-header"
import { ProdukTableWrapper } from "@/components/petugas/produk-table-wrapper"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TableSkeleton } from "@/components/shared/table-skeleton"

export default function ProdukPage() {
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

        <div className="space-y-8 px-6 pb-10 pt-4">
          <Suspense fallback={<TableSkeleton />}>
            <ProdukTableWrapper />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
