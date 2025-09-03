"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { PetugasForm } from "@/components/admin/petugas-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getPetugasById } from "@/components/lib/services/petugas.service"
import { toast } from "sonner"

export default function EditPetugasPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [petugasData, setPetugasData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPetugas() {
      try {
        const data = await getPetugasById(params.id)
        setPetugasData(data)
      } catch (err) {
        console.error("Failed to fetch petugas:", err)
        setError("Failed to load petugas data")
        toast.error("Failed to load petugas data")
      } finally {
        setLoading(false)
      }
    }

    fetchPetugas()
  }, [params.id])

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
                <h1 className="text-2xl font-bold">Edit Petugas</h1>
                <p className="text-muted-foreground">Update the details for this petugas</p>
              </div>
              <div className="px-4 lg:px-6">
                <div className="bg-card rounded-lg border p-6">
                  <PetugasForm initialData={petugasData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}