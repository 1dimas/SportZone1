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
  FileSpreadsheet,
  Search,
  Package,
  Boxes,
  TrendingUp,
  DollarSign,
  CreditCard,
  Calendar,
  User,
  Loader2
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
  getAllOrders,
  exportOrderToExcel,
} from "@/components/lib/services/order.service";
import { getAllPembayaran } from "@/components/lib/services/pembayaran.service";

interface OrderReport {
  id: string;
  username: string;
  email: string;
  tanggal: string;
  lokasi: string;
  total_harga: number;
  status_pesanan: string;
  jumlah_item: number;
  metode_pembayaran: string;
  status_pembayaran: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const columns: ColumnDef<OrderReport>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-left font-semibold">ID Pesanan</div>,
    cell: ({ row }) => (
      <div className="font-mono text-sm text-gray-900">
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: () => <div className="text-center font-semibold">Username</div>,
    cell: ({ row }) => (
      <div className="text-center text-gray-900">
        {row.original.username}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center font-semibold">Email</div>,
    cell: ({ row }) => (
      <div className="text-center text-gray-600">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "tanggal",
    header: () => <div className="text-center font-semibold">Tanggal</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.tanggal}
      </div>
    ),
  },
  {
    accessorKey: "lokasi",
    header: () => <div className="text-center font-semibold">Lokasi</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="font-normal">
          {row.original.lokasi}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "total_harga",
    header: () => <div className="text-right font-semibold">Total Harga</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium text-gray-900">
        {formatCurrency(row.original.total_harga)}
      </div>
    ),
  },
  {
    accessorKey: "status_pesanan",
    header: () => <div className="text-center font-semibold">Status Pesanan</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          className={
            row.original.status_pesanan === "diproses"
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
              : row.original.status_pesanan === "dikirim"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                : row.original.status_pesanan === "selesai"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
          }
        >
          {row.original.status_pesanan === "diproses"
            ? "Diproses"
            : row.original.status_pesanan === "dikirim"
              ? "Dikirim"
              : row.original.status_pesanan === "selesai"
                ? "Selesai"
                : "Dibatalkan"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "jumlah_item",
    header: () => <div className="text-center font-semibold">Jumlah Item</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.original.jumlah_item}
      </div>
    ),
  },
  {
    accessorKey: "metode_pembayaran",
    header: () => <div className="text-center font-semibold">Metode Pembayaran</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary" className="capitalize">
          {row.original.metode_pembayaran}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status_pembayaran",
    header: () => <div className="text-center font-semibold">Status Pembayaran</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge
          className={
            row.original.status_pembayaran === "berhasil"
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
              : row.original.status_pembayaran === "pending"
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
          }
        >
          {row.original.status_pembayaran === "berhasil"
            ? "Berhasil"
            : row.original.status_pembayaran === "pending"
              ? "Pending"
              : "Gagal"}
        </Badge>
      </div>
    ),
  },
];

export function LaporanOrderTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [data, setData] = React.useState<OrderReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItems: 0,
    completedOrders: 0,
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const orderData = await getAllOrders();

      const transformedData = orderData.map((order: any) => ({
        id: order.id,
        username: order.user?.username || '-',
        email: order.user?.email || '-',
        tanggal: order.tanggal_pesanan
          ? formatDate(order.tanggal_pesanan)
          : '-',
        lokasi: `${order.kota || '-'}/${order.provinsi || '-'}`,
        total_harga: Number(order.total_harga || 0),
        status_pesanan: order.status || 'diproses',
        jumlah_item: order.pesanan_items?.length || 0,
        metode_pembayaran: order.pembayaran?.metode || '-',
        status_pembayaran: order.pembayaran?.status || '-',
      }));

      setData(transformedData);

      // Fetch payment data to calculate revenue like in dashboard admin
      const pembayaranData = await getAllPembayaran();
      const paidPayments = pembayaranData.filter(p => p.status === "sudah bayar");
      const totalRevenue = paidPayments.reduce((sum, p) => {
        const amount = Number(p.pesanan?.total_harga) || 0;
        return sum + amount;
      }, 0);

      const completedOrders = transformedData.filter(order => order.status_pesanan === 'selesai').length;

      setStats({
        totalOrders: transformedData.length,
        totalRevenue,
        totalItems: transformedData.reduce((sum, order) => sum + order.jumlah_item, 0),
        completedOrders,
      });
    } catch (error) {
      console.error("Error fetching order report:", error);
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

  const exportToExcel = async () => {
    try {
      await exportOrderToExcel();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Gagal mengexport data ke Excel. Silakan coba lagi.");
    }
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
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pendapatan</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
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
            placeholder="Cari order..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="pl-10 h-11 rounded-xl border-gray-200 focus:border-orange-500"
          />
        </div>
        <Button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-11 gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel
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
                    Tidak ada data order.
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
          Menampilkan {table.getFilteredRowModel().rows.length} order
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