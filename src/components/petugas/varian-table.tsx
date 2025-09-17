"use client"

import * as React from "react"
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconPlus,
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
import { deleteVarian } from "@/components/lib/services/varian.service"

export const varianSchema = z.object({
  id: z.string(),
  produk_id: z.string(),
  ukuran: z.string().optional(),
  warna: z.string().optional(),
  stok: z.number(),
  harga: z.number().optional(),
  sku: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

type Varian = z.infer<typeof varianSchema>

const columns: ColumnDef<Varian>[] = [
  {
    accessorKey: "ukuran",
    header: "Ukuran",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.ukuran || "-"}</div>
    ),
  },
  {
    accessorKey: "warna",
    header: "Warna",
    cell: ({ row }) => (
      <div>
        {row.original.warna ? (
          <div className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded-full border" 
              style={{ backgroundColor: row.original.warna }}
            ></div>
            <span>{row.original.warna}</span>
          </div>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    accessorKey: "stok",
    header: "Stok",
    cell: ({ row }) => (
      <div className="text-right">
        <Badge 
          variant={row.original.stok === 0 ? "destructive" : row.original.stok < 10 ? "secondary" : "default"}
        >
          {row.original.stok}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.harga ? `Rp ${row.original.harga.toLocaleString('id-ID')}` : "-"}
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.sku || "-"}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Dibuat",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.created_at).toLocaleDateString('id-ID')}
      </div>
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
              window.location.href = `/dashboardpetugas/produk/${row.original.produk_id}/varian/${row.original.id}/edit`
            }}
          >
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              if (confirm("Apakah Anda yakin ingin menghapus varian ini?")) {
                try {
                  await deleteVarian(row.original.id)
                  toast.success("Varian berhasil dihapus")
                  window.location.reload()
                } catch (error) {
                  toast.error("Gagal menghapus varian")
                }
              }
            }}
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

interface VarianTableProps {
  data: Varian[]
  produkId: string
}

export function VarianTable({ data, produkId }: VarianTableProps) {
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
          placeholder="Cari varian..."
          value={(table.getColumn("ukuran")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("ukuran")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button 
          onClick={() => {
            window.location.href = `/dashboardpetugas/produk/${produkId}/varian/create`
          }}
          className="gap-2"
        >
          <IconPlus className="h-4 w-4" />
          Tambah Varian
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  Tidak ada data varian.{" "}
                  <Button
                    variant="link"
                    onClick={() => {
                      window.location.href = `/dashboardpetugas/produk/${produkId}/varian/create`
                    }}
                    className="p-0"
                  >
                    Tambah varian pertama
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} varian dipilih.
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
