"use client"

import * as React from "react"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllPesanan, type Pesanan } from "@/components/lib/services/pesanan.service"

export function OrderListTable() {
  const [data, setData] = React.useState<Pesanan[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch data from backend
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const pesananData = await getAllPesanan()
        setData(pesananData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data pesanan")
        console.error("Error fetching pesanan:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const pageCount = Math.ceil(data.length / pagination.pageSize)
  const startIndex = pagination.pageIndex * pagination.pageSize
  const endIndex = startIndex + pagination.pageSize
  const currentPageData = data.slice(startIndex, endIndex)

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      "pending": { label: "Pending", className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
      "diproses": { label: "Diproses", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      "dikirim": { label: "Dikirim", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      "selesai": { label: "Selesai", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      "dibatalkan": { label: "Dibatalkan", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      "dikembalikan": { label: "Dikembalikan", className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    }
    const statusInfo = statusMap[status.toLowerCase()] || { label: status, className: "" }
    return (
      <Badge variant="outline" className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Daftar Pesanan</h2>
        </div>
        <div className="flex items-center justify-center h-64 rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daftar Pesanan</h2>
      </div>
      
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kota/Provinsi</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Jumlah Item</TableHead>
              <TableHead>Alamat Pengiriman</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Show skeleton rows while loading
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`skeleton-${idx}`}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                </TableRow>
              ))
            ) : currentPageData.length > 0 ? (
              currentPageData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.user?.username || order.user?.email || "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.tanggal_pesanan).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    {order.kota && order.provinsi 
                      ? `${order.kota}, ${order.provinsi}` 
                      : order.kota || order.provinsi || "N/A"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(order.total_harga)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-center">
                    {order.pesanan_items?.length || 0}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {order.alamat_pengiriman}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Tidak ada data pesanan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Menampilkan {startIndex + 1} - {Math.min(endIndex, data.length)} dari {data.length} pesanan
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Baris per halaman
            </Label>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                setPagination({ ...pagination, pageSize: Number(value), pageIndex: 0 })
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Halaman {pagination.pageIndex + 1} dari {pageCount || 1}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Ke halaman pertama</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Ke halaman sebelumnya</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Ke halaman selanjutnya</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPagination({ ...pagination, pageIndex: pageCount - 1 })}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Ke halaman terakhir</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
