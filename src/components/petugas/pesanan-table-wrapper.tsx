"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PesananTable } from "@/components/petugas/pesanan-table"
import {
  getAllPesanan,
  Pesanan,
} from "@/components/lib/services/pesanan.service"
import { toast } from "sonner"

export function PesananTableWrapper() {
  const [pesananData, setPesananData] = useState<Pesanan[]>([])
  const router = useRouter()

  const fetchPesanan = async () => {
    try {
      const data = await getAllPesanan()
      // Sort by creation date (newest first)
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.created_at || b.tanggal_pesanan).getTime() -
          new Date(a.created_at || a.tanggal_pesanan).getTime()
      )
      setPesananData(sortedData)
    } catch (err) {
      console.error("Failed to fetch pesanan:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      toast.error(`Gagal memuat data pesanan: ${errorMessage}`)
    }
  }

  useEffect(() => {
    fetchPesanan()
  }, [])

  const handleViewDetail = (id: string) => {
    router.push(`/dashboardpetugas/pesanan/${id}`)
  }

  return (
    <PesananTable
      data={pesananData}
      onRefresh={fetchPesanan}
      onViewDetail={handleViewDetail}
    />
  )
}
