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
      <div className="font-medium max-w-[200px] truncate">
        {row.original.nama}
      </div>
    ),
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ row }) => {
      const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount);
      };
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.original.harga)}
        </div>
      );
    },
  },
  {
    accessorKey: "subkategori.kategoriOlahraga.nama",
    header: "Olahraga",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.subkategori?.kategoriOlahraga?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "subkategori.nama",
    header: "Alat",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.subkategori?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "brand.nama",
    header: "Brand",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.brand?.nama || "-"}
      </div>
    ),
  },
  {
    accessorKey: "stok",
    header: "Stok",
    cell: ({ row }) => (
      <StockCell produkId={row.original.id} produkStok={row.original.stok} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "aktif" ? "default" : "secondary"}
      >
        {row.original.status === "aktif"
          ? "Aktif"
          : row.original.status === "nonaktif"
          ? "Nonaktif"
          : "Stok Habis"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionsCell produkId={row.original.id} />,
  },
];

function VarianList({ produkId }: { produkId: string }) {
  const [varian, setVarian] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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
    return <div className="text-sm text-muted-foreground">Memuat...</div>;
  }

  if (varian.length === 0) {
    return <div className="text-sm text-muted-foreground">-</div>;
  }

  return (
    <ul className="list-disc list-inside max-h-40 overflow-auto text-sm">
      {varian.map((v, idx) => (
        <li key={idx}>
          {v.ukuran && `Ukuran: ${v.ukuran}`}
          {v.warna && `, Warna: ${v.warna}`}
          {`, Stok: ${v.stok}`}
          {v.harga && `, Harga: ${formatCurrency(v.harga)}`}
        </li>
      ))}
    </ul>
  );
}

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
    return <div className="text-sm text-muted-foreground">Memuat...</div>;
  }

  if (varian.length > 0) {
    // Jika ada varian, hitung total stok dari semua varian
    const totalStok = varian.reduce((sum, v) => sum + (v.stok || 0), 0);
    return <div className="text-right font-medium">{totalStok}</div>;
  } else {
    // Jika tidak ada varian, tampilkan stok dari produk induk
    return <div className="text-right font-medium">{produkStok || 0}</div>;
  }
}

function ActionsCell({ produkId }: { produkId: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/dashboardadmin/produk/${produkId}`)}
    >
      <Eye className="w-4 h-4 mr-2" />
      Lihat Detail
    </Button>
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
                  );
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
          <button
            className="border rounded px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </button>
          <div className="text-sm">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </div>
          <button
            className="border rounded px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
