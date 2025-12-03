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
import { IconChevronLeft, IconChevronRight, IconDownload } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllProduk,
  getVarianByProduk,
  getTotalSoldByProduct,
} from "@/components/lib/services/produk.service";

interface ProdukReport {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  status: string;
  subkategori?: {
    nama: string;
    kategoriOlahraga?: {
      nama: string;
    };
  };
  brand?: {
    nama: string;
  };
  totalTerjual: number;
  nilaiStok: number;
}

interface ProdukData {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  status: string;
  subkategori?: {
    nama: string;
    kategoriOlahraga?: {
      nama: string;
    };
  };
  brand?: {
    nama: string;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const columns: ColumnDef<ProdukReport>[] = [
  {
    accessorKey: "nama",
    header: () => <div className="text-left">Nama Produk</div>,
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-[200px]">
        {row.original.nama}
      </div>
    ),
  },
  {
    accessorKey: "subkategori.kategoriOlahraga.nama",
    header: () => <div className="text-center">Kategori</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.subkategori?.kategoriOlahraga?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "brand.nama",
    header: () => <div className="text-center">Brand</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.brand?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "harga",
    header: () => <div className="text-right">Harga</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.original.harga)}
      </div>
    ),
  },
  {
    accessorKey: "stok",
    header: () => <div className="text-center">Stok</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.stok}</div>
    ),
  },
  {
    accessorKey: "totalTerjual",
    header: () => <div className="text-center">Total Terjual</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium text-green-600">
        {row.original.totalTerjual}
      </div>
    ),
  },
  {
    accessorKey: "nilaiStok",
    header: () => <div className="text-right">Nilai Stok</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.original.nilaiStok)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          variant={
            row.original.status === "aktif"
              ? "default"
              : row.original.status === "stok habis"
              ? "secondary"
              : "outline"
          }
        >
          {row.original.status === "aktif"
            ? "Aktif"
            : row.original.status === "nonaktif"
            ? "Nonaktif"
            : "Stok Habis"}
        </Badge>
      </div>
    ),
  },
];

export function LaporanProdukTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [data, setData] = React.useState<ProdukReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalProduk: 0,
    totalStok: 0,
    totalNilaiStok: 0,
    totalTerjual: 0,
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const produkData = await getAllProduk();

      const enrichedData = await Promise.all(
        produkData.map(async (produk: ProdukData) => {
          let totalStok = produk.stok || 0;

          try {
            const varian = await getVarianByProduk(produk.id);
            if (varian.length > 0) {
              totalStok = varian.reduce((sum, v) => sum + (v.stok || 0), 0);
            }
          } catch (error) {
            console.error(`Error fetching variants for ${produk.id}:`, error);
          }

          const totalTerjual = await getTotalSoldByProduct(produk.id);
          const nilaiStok = totalStok * (produk.harga || 0);

          return {
            id: produk.id,
            nama: produk.nama,
            harga: produk.harga || 0,
            stok: totalStok,
            status: produk.status,
            subkategori: produk.subkategori,
            brand: produk.brand,
            totalTerjual,
            nilaiStok,
          };
        })
      );

      setData(enrichedData);

      const totalStok = enrichedData.reduce((sum, p) => sum + p.stok, 0);
      const totalNilaiStok = enrichedData.reduce((sum, p) => sum + p.nilaiStok, 0);
      const totalTerjual = enrichedData.reduce((sum, p) => sum + p.totalTerjual, 0);

      setStats({
        totalProduk: enrichedData.length,
        totalStok,
        totalNilaiStok,
        totalTerjual,
      });
    } catch (error) {
      console.error("Error fetching product report:", error);
    } finally {
      setLoading(false);
    }
  };

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const exportToCSV = () => {
    const headers = ["Nama Produk", "Kategori", "Brand", "Harga", "Stok", "Total Terjual", "Nilai Stok", "Status"];
    const rows = data.map((item) => [
      item.nama,
      item.subkategori?.kategoriOlahraga?.nama || "-",
      item.brand?.nama || "-",
      item.harga,
      item.stok,
      item.totalTerjual,
      item.nilaiStok,
      item.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-produk-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data laporan...</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Total Produk</div>
          <div className="text-2xl font-bold">{stats.totalProduk}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Total Stok</div>
          <div className="text-2xl font-bold">{stats.totalStok}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Total Terjual</div>
          <div className="text-2xl font-bold text-green-600">{stats.totalTerjual}</div>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <div className="text-sm text-muted-foreground">Nilai Stok</div>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalNilaiStok)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Cari produk..."
          value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nama")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={exportToCSV} variant="outline">
          <IconDownload className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 text-sm font-semibold">
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
                <TableRow key={row.id} className="even:bg-muted/20 hover:bg-muted/40 transition">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data produk.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {table.getFilteredRowModel().rows.length} produk
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="w-4 h-4 mr-2" />
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
            <IconChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
