"use client"

import { useEffect, useState } from "react"
import { PetugasTable } from "@/components/admin/petugas-table"
import { getAllPetugas } from "@/components/lib/services/petugas.service"
import { petugasSchema } from "@/components/admin/petugas-table"
import { z } from "zod"
import { toast } from "sonner"

export function PetugasTableWrapper() {
  const [petugasData, setPetugasData] = useState<z.infer<typeof petugasSchema>[]>([])

  const fetchPetugas = async () => {
    try {
      const data = await getAllPetugas()
      setPetugasData(data)
    } catch (err) {
      console.error("Failed to fetch petugas:", err)
      toast.error("Failed to load petugas data")
    }
  }

  useEffect(() => {
    fetchPetugas()
  }, [])

  return <PetugasTable data={petugasData} onRefresh={fetchPetugas} />
}
