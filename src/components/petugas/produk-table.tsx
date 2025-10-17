"use client"

import * as React from "react"
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteProduk } from "@/components/lib/services/produk.service"
import { triggerProductRefresh } from "@/components/lib/utils/product-refresh"

export const produkSchema = z.object({
  id: z.string(),
  nama: z.string(),
  deskripsi: z.string(),
  harga: z.number(),
  gambar: z.array(z.string()).optional(),
  status: z.enum(["aktif", "nonaktif", "stok habis"]),
  subkategori: z.object({
    nama: z.string(),
    kategoriOlahraga: z.object({
      nama: z.string(),
    }).optional(),
  }).optional(),
  brand: z.object({
    nama: z.string(),
  }).optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

type Produk = z.infer<typeof produkSchema>

const columns: ColumnDef<Produk>[] = [
  {
    accessorKey: "gambar",
    header: "Foto",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.gambar && row.original.gambar.length > 0 ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <img
              src={row.original.gambar[0]}
              alt={row.original.nama}
              className="h-full w-full object-cover"
            />
            {row.original.gambar.length > 1 && (
              <div className="absolute bottom-0 right-0 rounded-full bg-primary px-1 text-xs text-primary-foreground">
                +{row.original.gambar.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "nama",
    header: "Nama Produk",
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate">{row.original.nama}</div>
    ),
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        Rp {(row.original.harga || 0).toLocaleString('id-ID')}
      </div>
    ),
  },
  {
    accessorKey: "subkategori.kategoriOlahraga.nama",
    header: "Olahraga",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.subkategori?.kategoriOlahraga?.nama || "-"}</div>
    ),
  },
  {
    accessorKey: "subkategori.nama",
    header: "Alat",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.subkategori?.nama || "-"}</div>
    ),
  },
  {
    accessorKey: "brand.nama",
    header: "Brand",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.brand?.nama || "-"}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "aktif" ? "default" : "secondary"}
      >
        {row.original.status === "aktif" ? "Aktif" : row.original.status === "nonaktif" ? "Nonaktif" : "Stok Habis"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              window.location.href = `/dashboardpetugas/produk/${row.original.id}`
            }}
          >
            <IconEye className="mr-2 h-4 w-4" />
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              window.location.href = `/dashboardpetugas/produk/${row.original.id}/edit`
            }}
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                try {
                  await deleteProduk(row.original.id)
                  toast.success("Produk berhasil dihapus")
                  triggerProductRefresh()
                } catch (error) {
                  toast.error("Gagal menghapus produk")
                }
              }
            }}
          >
            <IconTrash className="mr-2 h-4 w-4" />\n            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

interface ProdukTableProps {
  data: Produk[]
}

export function ProdukTable({ data }: ProdukTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Cari produk..."
          value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nama")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Menampilkan {table.getFilteredRowModel().rows.length} produk
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data produk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} produk dipilih.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <div className="text-sm">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
