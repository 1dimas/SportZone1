"use client"

import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/petugas/app-sidebar"
import { SiteHeader } from "@/components/petugas/site-header"
import { PesananDetail } from "@/components/petugas/pesanan-detail"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function PesananDetailPage() {
  const params = useParams()
  const id = params.id as string

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Detail Pesanan</h1>
                <p className="text-muted-foreground">Lihat dan kelola detail pesanan</p>
              </div>
              <div className="px-4 lg:px-6">
                <PesananDetail id={id} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
