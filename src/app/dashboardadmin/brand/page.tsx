 "use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { BrandTable } from "@/components/admin/brand-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getAllBrands } from "@/components/lib/services/brand.service"
import { brandSchema } from "@/components/admin/brand-table"
import { z } from "zod"
import { toast } from "sonner"

export default function BrandListPage() {
  const [brandData, setBrandData] = useState<z.infer<typeof brandSchema>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const data = await getAllBrands()
      setBrandData(data)
    } catch (err) {
      console.error("Failed to fetch brands:", err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Failed to load brand data: ${errorMessage}`)
      toast.error(`Failed to load brand data: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Brand Management</h1>
                <p className="text-muted-foreground">Manage your brands here</p>
              </div>
              <div className="px-4 lg:px-6">
                <BrandTable data={brandData} onRefresh={fetchBrands} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
