"use client"

import * as React from "react"
import { IconCurrencyDollar, IconShoppingBag, IconAlertTriangle, IconPackage } from "@tabler/icons-react"
import { TrendingUp, TrendingDown } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SkeletonCard } from "@/components/ui/skeleton";
import { getAllPembayaran } from "@/components/lib/services/pembayaran.service";
import { getAllPesanan } from "@/components/lib/services/pesanan.service";
import { getAllProdukRusak, getAllPengembalian } from "@/components/lib/services/pengembalian.service";

interface DashboardSectionCardsProps {
  /** Optional: Label untuk debugging console logs (e.g., "ADMIN" or "PETUGAS") */
  userRole?: string;
  /** Optional: Show warning banner when permission error occurs */
  showPermissionWarning?: boolean;
}

interface TrendData {
  change: number; // percentage
  direction: 'up' | 'down' | 'neutral';
  isPositive: boolean; // whether the trend is good for business
}

export function DashboardSectionCards({ userRole = "USER", showPermissionWarning = true }: DashboardSectionCardsProps) {
  const [totalRevenue, setTotalRevenue] = React.useState<number>(0);
  const [totalOrders, setTotalOrders] = React.useState<number>(0);
  const [totalDamagedProducts, setTotalDamagedProducts] = React.useState<number>(0);
  const [totalReturns, setTotalReturns] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [hasPermissionError, setHasPermissionError] = React.useState(false);

  // Mock trend data (in real app, this would come from comparing with previous period)
  const revenueTrend: TrendData = { change: 12.5, direction: 'up', isPositive: true };
  const ordersTrend: TrendData = { change: 8.3, direction: 'up', isPositive: true };
  const damagedTrend: TrendData = { change: 15.2, direction: 'down', isPositive: true }; // down is good for damaged
  const returnsTrend: TrendData = { change: 5.7, direction: 'down', isPositive: true }; // down is good for returns

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`=== ${userRole} DASHBOARD DEBUG START ===`);
        
        // Fetch revenue data
        console.log("Fetching pembayaran data...");
        const pembayaranData = await getAllPembayaran();
        console.log(`${userRole} - Raw pembayaran data:`, pembayaranData);
        console.log(`${userRole} - Total pembayaran records:`, pembayaranData.length);
        
        const paidPayments = pembayaranData.filter(p => p.status === "sudah bayar");
        console.log(`${userRole} - Paid payments:`, paidPayments);
        console.log(`${userRole} - Paid payments count:`, paidPayments.length);
        
        const revenue = paidPayments.reduce((sum, p) => {
          // Convert to number to prevent string concatenation
          const amount = Number(p.pesanan?.total_harga) || 0;
          console.log(`  Payment ${p.id}: ${amount} (type: ${typeof amount})`);
          return sum + amount;
        }, 0);
        console.log(`${userRole} - Total Revenue:`, revenue);
        setTotalRevenue(revenue);
        
        // Fetch total orders
        console.log("\nFetching pesanan data...");
        const pesananData = await getAllPesanan();
        console.log(`${userRole} - Raw pesanan data:`, pesananData);
        console.log(`${userRole} - Total Orders:`, pesananData.length);
        setTotalOrders(pesananData.length);
        
        // Fetch damaged products
        console.log("\nFetching produk rusak data...");
        const produkRusakData = await getAllProdukRusak();
        console.log(`${userRole} - Raw produk rusak data:`, produkRusakData);
        console.log(`${userRole} - Produk rusak records:`, produkRusakData.length);
        
        const totalDamaged = produkRusakData.reduce((sum, item) => {
          const jumlah = Number(item.jumlah) || 0;
          console.log(`  Damaged product ${item.id}: ${jumlah} items`);
          return sum + jumlah;
        }, 0);
        console.log(`${userRole} - Total Damaged Products:`, totalDamaged);
        setTotalDamagedProducts(totalDamaged);

        // Fetch total returns (count number of return requests)
        console.log("\nFetching pengembalian data...");
        const pengembalianData = await getAllPengembalian();
        console.log(`${userRole} - Raw pengembalian data:`, pengembalianData);
        console.log(`${userRole} - Pengembalian records:`, pengembalianData.length);
        
        // Count the number of return requests (Pengembalian doesn't have jumlah property)
        const totalReturns = pengembalianData.length;
        console.log(`${userRole} - Total Returns:`, totalReturns);
        setTotalReturns(totalReturns);
        
        console.log(`\n=== ${userRole} DASHBOARD SUMMARY ===`);
        console.log("Total Revenue:", revenue);
        console.log("Total Orders:", pesananData.length);
        console.log("Total Damaged Products:", totalDamaged);
        console.log("Total Return Requests:", totalReturns);
        console.log(`=== ${userRole} DASHBOARD DEBUG END ===\n`);
        
      } catch (err) {
        console.error(`${userRole} - Error fetching dashboard data:`, err);
        
        // Check if it's a 403 permission error
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('403') || errorMessage.includes('Forbidden') || errorMessage.includes('Access denied')) {
          setHasPermissionError(true);
          console.warn(`⚠️ Dashboard data not accessible for ${userRole} role.`);
          console.warn("📋 Action required: Update backend permissions to allow read-only access.");
        }
        
        // Set default values so UI doesn't break
        setTotalRevenue(0);
        setTotalOrders(0);
        setTotalDamagedProducts(0);
        setTotalReturns(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const TrendIndicator = ({ trend }: { trend: TrendData }) => {
    const TrendIcon = trend.direction === 'up' ? TrendingUp : TrendingDown;
    const isPositiveTrend = trend.isPositive;
    const colorClass = isPositiveTrend ? 'text-emerald-600' : 'text-red-600';
    const bgClass = isPositiveTrend ? 'bg-emerald-50' : 'bg-red-50';
    
    return (
      <div className={`flex items-center gap-2 mt-3 ${bgClass} rounded-lg px-3 py-2 w-fit`}>
        <TrendIcon className={`h-4 w-4 ${colorClass}`} />
        <div className="flex items-baseline gap-1.5">
          <span className={`text-sm font-bold ${colorClass}`}>
            {trend.direction === 'up' ? '+' : '-'}{trend.change}%
          </span>
          <span className="text-xs text-gray-600">dari bulan lalu</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {hasPermissionError && showPermissionWarning && (
        <div className="mx-4 mb-4 lg:mx-6 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/20 p-4">
          <div className="flex gap-3">
            <div className="text-orange-600 dark:text-orange-500">⚠️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-200 mb-1">
                Dashboard Data Unavailable
              </h3>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                {userRole} role does not have permission to access dashboard statistics. 
                Please contact your administrator to enable read-only access for dashboard viewing.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
        <Card className="@container/card bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-3">
                <IconCurrencyDollar className="size-7 text-orange-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <CardDescription className="text-white/80 text-sm font-medium mb-1">Total Revenue</CardDescription>
                <CardTitle className="text-2xl font-bold tabular-nums text-white">
                  {loading ? "Loading..." : formatCurrency(totalRevenue)}
                </CardTitle>
                <TrendIndicator trend={revenueTrend} />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-3">
                <IconShoppingBag className="size-7 text-orange-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <CardDescription className="text-white/80 text-sm font-medium mb-1">Total Orders</CardDescription>
                <CardTitle className="text-2xl font-bold tabular-nums text-white">
                  {loading ? "..." : totalOrders}
                </CardTitle>
                <TrendIndicator trend={ordersTrend} />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-3">
                <IconAlertTriangle className="size-7 text-orange-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <CardDescription className="text-white/80 text-sm font-medium mb-1">Total Damaged Products</CardDescription>
                <CardTitle className="text-2xl font-bold tabular-nums text-white">
                  {loading ? "..." : totalDamagedProducts}
                </CardTitle>
                <TrendIndicator trend={damagedTrend} />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-gradient-to-br from-orange-500 to-orange-600 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white p-3">
                <IconPackage className="size-7 text-orange-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <CardDescription className="text-white/80 text-sm font-medium mb-1">Total Returns</CardDescription>
                <CardTitle className="text-2xl font-bold tabular-nums text-white">
                  {loading ? "..." : totalReturns}
                </CardTitle>
                <TrendIndicator trend={returnsTrend} />
              </div>
            </div>
          </CardHeader>
        </Card>
          </>
        )}
      </div>
    </>
  )
}
