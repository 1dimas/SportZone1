"use client"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { SubkategoriPeralatanForm } from "@/components/admin/subkategori-peralatan-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function CreateSubkategoriPeralatanPage() {
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
                <h1 className="text-2xl font-bold">Create New Subkategori Peralatan</h1>
                <p className="text-muted-foreground">Fill in the details to create a new equipment subcategory</p>
              </div>
              <div className="px-4 lg:px-6">
                <div className="bg-card rounded-lg border p-6">
                  <SubkategoriPeralatanForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}