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
import { z } from "zod";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

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
} from "@/components/lib/services/produk.service";

export const produkSchema = z.object({
  id: z.string(),
  nama: z.string(),
  deskripsi: z.string(),
  harga: z.number(),
  stok: z.number().optional(),
  gambar: z.array(z.string()).optional(),
  status: z.enum(["aktif", "nonaktif", "stok habis"]),
  subkategori: z
    .object({
      nama: z.string(),
      kategoriOlahraga: z
        .object({
          nama: z.string(),
        })
        .optional(),
    })
    .optional(),
  brand: z
    .object({
      nama: z.string(),
    })
    .optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

type Produk = z.infer<typeof produkSchema>;

const columns: ColumnDef<Produk>[] = [
  {
    accessorKey: "gambar",
    header: () => <div className="text-center">Foto</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.gambar && row.original.gambar.length > 0 ? (
          <div className="relative h-14 w-14 overflow-hidden rounded-md border bg-muted/30">
            <img
              src={row.original.gambar[0]}
              alt={row.original.nama}
              className="h-full w-full object-cover"
            />
            {row.original.gambar.length > 1 && (
              <div className="absolute bottom-0 right-0 rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                +{row.original.gambar.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted">
            <span className="text-[10px] text-muted-foreground">No Image</span>
          </div>
        )}
      </div>
    ),
  },
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
    accessorKey: "harga",
    header: () => <div className="text-center">Harga</div>,
    cell: ({ row }) => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount);
      };
      return (
        <div className="text-center font-medium text-gray-800">
          {formatCurrency(row.original.harga || 0)}
        </div>
      );
    },
  },
  {
    accessorKey: "subkategori.kategoriOlahraga.nama",
    header: () => <div className="text-center">Olahraga</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.subkategori?.kategoriOlahraga?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "subkategori.nama",
    header: () => <div className="text-center">Alat</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.original.subkategori?.nama || "-"}
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
    accessorKey: "stok",
    header: () => <div className="text-center">Stok</div>,
    cell: ({ row }) => (
      <StockCell produkId={row.original.id} produkStok={row.original.stok} />
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
  {
    id: "actions",
    header: () => <div className="text-center">Aksi</div>,
    cell: ({ row }) => <ActionsCell produkId={row.original.id} />,
  },
];

function StockCell({
  produkId,
  produkStok,
}: {
  produkId: string;
  produkStok?: number;
}) {
  const [varian, setVarian] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchVarian = async () => {
      try {
        const data = await getVarianByProduk(produkId);
        setVarian(data);
      } catch (error) {
        console.error("Error fetching variants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVarian();
  }, [produkId]);

  if (loading) {
    return (
      <div className="text-center text-sm text-muted-foreground">Memuat...</div>
    );
  }

  if (varian.length > 0) {
    const totalStok = varian.reduce((sum, v) => sum + (v.stok || 0), 0);
    return <div className="text-center font-medium">{totalStok}</div>;
  } else {
    return <div className="text-center font-medium">{produkStok || 0}</div>;
  }
}

function ActionsCell({ produkId }: { produkId: string }) {
  const router = useRouter();
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(`/dashboardadmin/produk/${produkId}`)}
      >
        <Eye className="w-4 h-4 mr-2" /> Lihat Detail
      </Button>
    </div>
  );
}

export function ProdukTableReadonly() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<Produk[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const produkData = await getAllProduk();
        setData(produkData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
  });

  if (loading) {
    return <div className="text-center py-8">Memuat data produk...</div>;
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
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

      {/* Table */}
      <div className="rounded-md border overflow-x-auto shadow-sm">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3 text-sm font-semibold text-center"
                  >
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
                  className="even:bg-muted/20 hover:bg-muted/40 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-sm text-center py-3"
                    >
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

      {/* Pagination */}
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
  );
}
