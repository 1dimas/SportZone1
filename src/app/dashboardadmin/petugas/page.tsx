"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { PetugasTable } from "@/components/admin/petugas-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getAllPetugas } from "@/components/lib/services/petugas.service"
import { petugasSchema } from "@/components/admin/petugas-table"
import { z } from "zod"
import { toast } from "sonner"

export default function PetugasListPage() {
  const [petugasData, setPetugasData] = useState<z.infer<typeof petugasSchema>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPetugas = async () => {
    try {
      setLoading(true)
      const data = await getAllPetugas()
      setPetugasData(data)
    } catch (err) {
      console.error("Failed to fetch petugas:", err)
      setError("Failed to load petugas data")
      toast.error("Failed to load petugas data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPetugas()
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
                <h1 className="text-2xl font-bold">Petugas Management</h1>
                <p className="text-muted-foreground">Manage your petugas here</p>
              </div>
              <div className="px-4 lg:px-6">
                <PetugasTable data={petugasData} onRefresh={fetchPetugas} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}