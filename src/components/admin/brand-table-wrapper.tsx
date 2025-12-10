"use client"

import { useEffect, useState } from "react"
import { BrandTable } from "@/components/admin/brand-table"
import { getAllBrands } from "@/components/lib/services/brand.service"
import { brandSchema } from "@/components/admin/brand-table"
import { z } from "zod"
import { toast } from "sonner"

export function BrandTableWrapper() {
  const [brandData, setBrandData] = useState<z.infer<typeof brandSchema>[]>([])

  const fetchBrands = async () => {
    try {
      const data = await getAllBrands()
      setBrandData(data)
    } catch (err) {
      console.error("Failed to fetch brands:", err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to load brand data: ${errorMessage}`)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  return <BrandTable data={brandData} onRefresh={fetchBrands} />
}
