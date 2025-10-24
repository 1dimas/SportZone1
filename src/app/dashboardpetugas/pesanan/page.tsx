"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/petugas/app-sidebar";
import { SiteHeader } from "@/components/petugas/site-header";
import { PesananTable } from "@/components/petugas/pesanan-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getAllPesanan,
  Pesanan,
} from "@/components/lib/services/pesanan.service";
import { toast } from "sonner";

export default function PesananListPage() {
  const [pesananData, setPesananData] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPesanan = async () => {
    try {
      setLoading(true);
      const data = await getAllPesanan();
      // Sort by creation date (newest first)
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.created_at || b.tanggal_pesanan).getTime() -
          new Date(a.created_at || a.tanggal_pesanan).getTime()
      );
      setPesananData(sortedData);
    } catch (err) {
      console.error("Failed to fetch pesanan:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load pesanan data: ${errorMessage}`);
      toast.error(`Failed to load pesanan data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const handleViewDetail = (id: string) => {
    router.push(`/dashboardpetugas/pesanan/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
                <p className="text-muted-foreground">
                  Kelola pesanan pelanggan
                </p>
              </div>
              <div className="px-4 lg:px-6">
                <PesananTable
                  data={pesananData}
                  onRefresh={fetchPesanan}
                  onViewDetail={handleViewDetail}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
