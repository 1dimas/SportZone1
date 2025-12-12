"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/admin/site-header"
import { BannerForm } from "@/components/admin/banner-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getBannerById, Banner } from "@/components/lib/services/banner.service"

export default function EditBannerPage() {
  const params = useParams()
  const bannerId = params.id as string

  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBannerById(bannerId)
        setBanner(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load banner")
      } finally {
        setLoading(false)
      }
    }

    if (bannerId) {
      fetchBanner()
    }
  }, [bannerId])

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
                <h1 className="text-2xl font-bold">Edit Banner</h1>
                <p className="text-muted-foreground">Update banner information</p>
              </div>
              <div className="px-4 lg:px-6">
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : banner ? (
                  <BannerForm
                    initialData={{
                      id: banner.id,
                      title: banner.title,
                      image_url: banner.image_url,
                      link_type: banner.link_type,
                      link_value: banner.link_value,
                      is_active: banner.is_active,
                      start_date: banner.start_date,
                      end_date: banner.end_date,
                    }}
                  />
                ) : (
                  <div>Banner not found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
