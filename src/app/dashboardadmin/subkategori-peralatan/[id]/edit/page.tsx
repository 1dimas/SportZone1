"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { SubkategoriPeralatanForm } from "@/components/admin/subkategori-peralatan-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getSubkategoriPeralatanById } from "@/components/lib/services/subkategori-peralatan.service"
import { toast } from "sonner"

export default function EditSubkategoriPeralatanPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [subkategoriData, setSubkategoriData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubkategori() {
      try {
        const data = await getSubkategoriPeralatanById(id)
        setSubkategoriData(data)
      } catch (err: any) {
        console.error("Failed to fetch subkategori peralatan:", err)
        setError(`Failed to load subkategori peralatan data: ${err.message}`)
        toast.error(`Failed to load subkategori peralatan data: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchSubkategori()
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
                <h1 className="text-2xl font-bold">Ubah Subkategori Peralatan</h1>
                <p className="text-muted-foreground">Perbarui detail subkategori peralatan ini</p>
              </div>
              <div className="px-4 lg:px-6">
                <div className="bg-card rounded-lg border p-6">
                  <SubkategoriPeralatanForm initialData={subkategoriData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}