"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { BrandForm } from "@/components/admin/brand-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getBrandById } from "@/components/lib/services/brand.service"
import { toast } from "sonner"

export default function EditBrandPage() {
  const params = useParams()
  const id = params.id as string

  const [initialData, setInitialData] = useState<{
    id: string
    nama: string
    deskripsi: string
    logo: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true)
        const data = await getBrandById(id)
        setInitialData(data)
      } catch (err) {
        console.error("Failed to fetch brand:", err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Failed to load brand data: ${errorMessage}`)
        toast.error(`Failed to load brand data: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBrand()
    }
  }, [id])

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
                <h1 className="text-2xl font-bold">Ubah Brand</h1>
                <p className="text-muted-foreground">Perbarui detail brand</p>
              </div>
              <div className="px-4 lg:px-6">
                <div className="bg-card rounded-lg border p-6">
                  {initialData && <BrandForm initialData={initialData} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
