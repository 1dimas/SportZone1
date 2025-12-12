"use client"

import { useEffect, useState } from "react"
import { BannerTable } from "./banner-table"
import { getAllBanners, Banner } from "@/components/lib/services/banner.service"

export function BannerTableWrapper() {
  const [data, setData] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }
      const banners = await getAllBanners(token)
      setData(banners)
    } catch (error) {
      console.error("Error fetching banners:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <BannerTable data={data} onRefresh={fetchData} />
}
