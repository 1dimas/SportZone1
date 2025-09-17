"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { KategoriOlahragaForm } from "@/components/admin/olahraga-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CreateKategoriOlahragaPage() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(true)

  const handleSuccess = () => {
    // Reset form after successful creation
    setShowForm(false)
    setTimeout(() => setShowForm(true), 100)
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
                    <h1 className="text-2xl font-bold">Create New Kategori Olahraga</h1>
                    <p className="text-muted-foreground">Fill in the details to create a new sports category</p>
                  </div>
                  <Button onClick={() => router.push("/dashboardadmin/olahraga")}>
                    Back to List
                  </Button>
                </div>
              </div>
              <div className="px-4 lg:px-6">
                <div className="bg-card rounded-lg border p-6">
                  {showForm ? (
                    <KategoriOlahragaForm onSuccess={handleSuccess} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-green-600 font-medium">Kategori olahraga created successfully!</p>
                      <p className="text-muted-foreground mt-2">Creating another category...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}