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
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Package,
  Boxes,
  TrendingUp,
  Loader2,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
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
    header: () => <div className="text-left font-semibold">Nama Produk</div>,
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-[200px] text-gray-900">
        {row.original.nama}
      </div>
    ),
  },
  {
    accessorKey: "subkategori.kategoriOlahraga.nama",
    header: () => <div className="text-center font-semibold">Kategori</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="font-normal">
          {row.original.subkategori?.kategoriOlahraga?.nama || "-"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "brand.nama",
    header: () => <div className="text-center font-semibold">Brand</div>,
    cell: ({ row }) => (
      <div className="text-center text-gray-600">
        {row.original.brand?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "harga",
    header: () => <div className="text-right font-semibold">Harga</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium text-gray-900">
        {formatCurrency(row.original.harga)}
      </div>
    ),
  },
  {
    accessorKey: "stok",
    header: () => <div className="text-center font-semibold">Stok</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className={`font-semibold ${row.original.stok <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
          {row.original.stok}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalTerjual",
    header: () => <div className="text-center font-semibold">Terjual</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <span className="font-semibold text-emerald-600">
          {row.original.totalTerjual}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nilaiStok",
    header: () => <div className="text-right font-semibold">Nilai Stok</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium text-gray-900">
        {formatCurrency(row.original.nilaiStok)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          className={
            row.original.status === "aktif"
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              : row.original.status === "stok habis"
                ? "bg-red-100 text-red-700 hover:bg-red-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
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
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-gray-500">Memuat data laporan...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProduk}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Stok</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStok}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Terjual</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalTerjual}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 font-bold">Rp</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nilai Stok</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalNilaiStok)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari produk..."
            value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nama")?.setFilterValue(event.target.value)
            }
            className="pl-10 h-11 rounded-xl border-gray-200 focus:border-orange-500"
          />
        </div>
        <Button
          onClick={exportToCSV}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 gap-2"
        >
          <Download className="w-4 h-4" />
          Ekspor CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
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
                    key={row.id}
                    className="even:bg-orange-50/30 hover:bg-orange-50/50 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-sm">
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
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Menampilkan {table.getFilteredRowModel().rows.length} produk
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>
          <div className="px-3 py-1 text-sm bg-gray-100 rounded-lg">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg gap-1"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
