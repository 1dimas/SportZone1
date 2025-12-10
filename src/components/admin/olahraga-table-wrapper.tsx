"use client"

import { useEffect, useState } from "react"
import { KategoriOlahragaTable } from "@/components/admin/olahraga-table"
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service"
import { kategoriOlahragaSchema } from "@/components/admin/olahraga-table"
import { z } from "zod"
import { toast } from "sonner"
import { addKategoriOlahragaRefreshListener } from "@/components/lib/utils/kategori-olahraga-refresh"

export function KategoriOlahragaTableWrapper() {
  const [kategoriData, setKategoriData] = useState<z.infer<typeof kategoriOlahragaSchema>[]>([])

  const fetchKategori = async () => {
    try {
      const data = await getAllKategoriOlahraga()
      setKategoriData(data)
    } catch (err) {
      console.error("Failed to fetch kategori olahraga:", err)
      toast.error(`Failed to load kategori olahraga data: ${err.message}`)
    }
  }

  useEffect(() => {
    fetchKategori()
    
    // Listen for kategori olahraga refresh events
    const removeListener = addKategoriOlahragaRefreshListener(fetchKategori)
    return removeListener
  }, [])

  return <KategoriOlahragaTable data={kategoriData} onRefresh={fetchKategori} />
}
