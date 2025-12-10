"use client"

import { useEffect, useState } from "react"
import { SubkategoriPeralatanTable } from "@/components/admin/subkategori-peralatan-table"
import { getAllSubkategoriPeralatan } from "@/components/lib/services/subkategori-peralatan.service"
import { subkategoriPeralatanSchema } from "@/components/admin/subkategori-peralatan-table"
import { z } from "zod"
import { toast } from "sonner"

export function SubkategoriPeralatanTableWrapper() {
  const [subkategoriData, setSubkategoriData] = useState<z.infer<typeof subkategoriPeralatanSchema>[]>([])

  const fetchSubkategori = async () => {
    try {
      const data = await getAllSubkategoriPeralatan()
      setSubkategoriData(data)
    } catch (err: any) {
      console.error("Failed to fetch subkategori peralatan:", err)
      toast.error(`Failed to load subkategori peralatan data: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchSubkategori()
  }, [])

  return <SubkategoriPeralatanTable data={subkategoriData} />
}
