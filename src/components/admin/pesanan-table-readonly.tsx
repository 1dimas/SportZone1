"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pesanan } from "@/components/lib/services/pesanan.service";
import {
  Pembayaran as PembayaranType,
  getPembayaranByPesananId,
  updatePembayaranStatus,
} from "@/components/lib/services/pembayaran.service";
import { toast } from "sonner";

// ==============================
// Utility Functions
// ==============================

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "diproses":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "dikirim":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "selesai":
      return "bg-green-100 text-green-800 border-green-200";
    case "dibatalkan":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ==============================
// Table Columns Definition
// ==============================
export const columns: ColumnDef<
  Pesanan & { pembayaran?: PembayaranType | null }
>[] = [
    {
      accessorKey: "id",
      header: "ID Pesanan",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.id.slice(0, 8)}...</div>
      ),
    },
    {
      id: "customer",
      header: "Pelanggan",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.user?.username || "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.user?.email || ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "tanggal_pesanan",
      header: "Tanggal",
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.original.tanggal_pesanan)}</div>
      ),
    },
    {
      id: "lokasi",
      header: "Kota/Provinsi",
      cell: ({ row }) => {
        const kota = row.original.kota;
        const provinsi = row.original.provinsi;
        const lokasi = [kota, provinsi].filter(Boolean).join(", ");
        return (
          <div className="text-sm text-muted-foreground">
            {lokasi || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "total_harga",
      header: "Total",
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.total_harga)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      id: "items",
      header: "Jumlah Item",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.pesanan_items?.length || 0}
        </div>
      ),
    },
    {
      id: "metode_pembayaran",
      header: "Metode Pembayaran",
      cell: ({ row }) => {
        const metode = row.original.pembayaran?.metode || null;
        const label = metode ? metode.toUpperCase() : "-";
        return <div className="text-sm">{label}</div>;
      },
    },
    {
      id: "status_pembayaran",
      header: "Status Pembayaran",
      cell: ({ row }) => {
        const status = row.original.pembayaran?.status;
        if (!status) return <div className="text-sm">-</div>;

        const color =
          status === "sudah bayar"
            ? "bg-green-100 text-green-800 border-green-200"
            : status === "belum bayar"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : status === "gagal"
                ? "bg-red-100 text-red-800 border-red-200"
                : "bg-gray-100 text-gray-800 border-gray-200";

        return <Badge className={color}>{status}</Badge>;
      },
    },
    {
      id: "aksi_pembayaran",
      header: "Aksi Pembayaran",
      cell: ({ row, table }) => {
        const pembayaran = row.original.pembayaran;
        if (
          !pembayaran ||
          pembayaran.metode !== "cod" ||
          pembayaran.status === "sudah bayar" ||
          pembayaran.status === "gagal"
        )
          return <div className="text-sm">-</div>;

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                try {
                  await updatePembayaranStatus(pembayaran.id, "sudah bayar");
                  toast.success("Status pembayaran COD diubah ke 'sudah bayar'");
                  await new Promise((r) => setTimeout(r, 200));
                  await (table.options.meta as any)?.refetch?.();
                } catch (e: any) {
                  toast.error(e?.message || "Gagal mengubah status pembayaran");
                }
              }}
            >
              Tandai Lunas
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                try {
                  await updatePembayaranStatus(pembayaran.id, "gagal");
                  toast.success("Status pembayaran COD diubah ke 'gagal'");
                  await new Promise((r) => setTimeout(r, 200));
                  await (table.options.meta as any)?.refetch?.();
                } catch (e: any) {
                  toast.error(e?.message || "Gagal mengubah status pembayaran");
                }
              }}
            >
              Tandai Gagal
            </Button>
          </div>
        );
      },
    },
  ];

// ==============================
// Component: PesananTableReadonly
// ==============================
export function PesananTableReadonly() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = React.useState<
    (Pesanan & { pembayaran?: PembayaranType | null })[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    try {
      const { getAllPesanan } = await import(
        "@/components/lib/services/pesanan.service"
      );
      const pesananData = await getAllPesanan();

      // Urutkan agar pesanan terbaru di atas
      const sortedPesanan = [...pesananData].sort(
        (a, b) =>
          new Date(b.tanggal_pesanan).getTime() -
          new Date(a.tanggal_pesanan).getTime()
      );

      const withPembayaran = await Promise.all(
        sortedPesanan.map(async (p) => {
          try {
            const pembayaran = await getPembayaranByPesananId(p.id);
            return { ...p, pembayaran };
          } catch {
            return { ...p, pembayaran: null };
          }
        })
      );

      setData(withPembayaran);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;
    const fetchData = async () => {
      await refetch();
    };
    if (active) fetchData();
    return () => {
      active = false;
    };
  }, [refetch]);


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { refetch },
  });

  if (loading) {
    return <div className="text-center py-8">Memuat data pesanan...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Info */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Cari berdasarkan nama pelanggan..."
          value={
            (table.getColumn("customer")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customer")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Menampilkan {table.getFilteredRowModel().rows.length} pesanan
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-orange-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 text-sm font-semibold text-orange-900">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-orange-50/30 hover:bg-orange-50/50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm">
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
                  Tidak ada pesanan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} baris dipilih.
        </div>

        <div className="flex items-center gap-8">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Baris per halaman</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue
                  placeholder={String(table.getState().pagination.pageSize)}
                />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center justify-center text-sm font-medium">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
