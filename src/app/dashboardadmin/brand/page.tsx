"use client"

import { Suspense } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { BrandTableWrapper } from "@/components/admin/brand-table-wrapper"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TableSkeleton } from "@/components/shared/table-skeleton"

export default function BrandListPage() {
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
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Manajemen Brand</h1>
                <p className="text-muted-foreground">Kelola brand Anda di sini</p>
              </div>
              <div className="px-4 lg:px-6">
                <Suspense fallback={<TableSkeleton />}>
                  <BrandTableWrapper />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
