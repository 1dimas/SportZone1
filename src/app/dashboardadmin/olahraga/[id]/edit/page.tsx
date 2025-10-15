"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { KategoriOlahragaForm } from "@/components/admin/olahraga-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getKategoriOlahragaById } from "@/components/lib/services/olahraga.service"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function EditKategoriOlahragaPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params)
  const router = useRouter()
  const [kategoriData, setKategoriData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchKategori() {
      try {
        const data = await getKategoriOlahragaById(id)
        setKategoriData(data)
      } catch (err) {
        console.error("Failed to fetch kategori olahraga:", err)
        setError("Failed to load kategori olahraga data")
        toast.error("Failed to load kategori olahraga data")
      } finally {
        setLoading(false)
      }
    }

    fetchKategori()
  }, [id])

  const handleSuccess = () => {
    // Stay on the same page after successful update
    toast.success("Kategori olahraga updated successfully!")
  }

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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Edit Kategori Olahraga</h1>
                    <p className="text-muted-foreground">Update the details for this sports category</p>
                  </div>
                  <Button onClick={() => router.push("/dashboardadmin/olahraga")}>
                    Back to List
                  </Button>
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <div className="bg-card rounded-lg border p-6">
                  <KategoriOlahragaForm initialData={kategoriData} onSuccess={handleSuccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}