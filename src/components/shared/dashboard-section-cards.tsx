"use client"

import * as React from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAllPembayaran } from "@/components/lib/services/pembayaran.service";
import { getAllPesanan } from "@/components/lib/services/pesanan.service";
import { getAllProdukRusak, getAllPengembalian } from "@/components/lib/services/pengembalian.service";

interface DashboardSectionCardsProps {
  /** Optional: Label untuk debugging console logs (e.g., "ADMIN" or "PETUGAS") */
  userRole?: string;
  /** Optional: Show warning banner when permission error occurs */
  showPermissionWarning?: boolean;
}

export function DashboardSectionCards({ userRole = "USER", showPermissionWarning = true }: DashboardSectionCardsProps) {
  const [totalRevenue, setTotalRevenue] = React.useState<number>(0);
  const [totalOrders, setTotalOrders] = React.useState<number>(0);
  const [totalDamagedProducts, setTotalDamagedProducts] = React.useState<number>(0);
  const [totalReturns, setTotalReturns] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [hasPermissionError, setHasPermissionError] = React.useState(false);

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

  return (
    <>
      {hasPermissionError && showPermissionWarning && (
        <div className="mx-4 mb-4 lg:mx-6 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4">
          <div className="flex gap-3">
            <div className="text-amber-600 dark:text-amber-500">⚠️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                Dashboard Data Unavailable
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                {userRole} role does not have permission to access dashboard statistics. 
                Please contact your administrator to enable read-only access for dashboard viewing.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "Loading..." : formatCurrency(totalRevenue)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              From paid orders
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : totalOrders}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                +8.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Good performance <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">All orders from customers</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Damaged Products</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : totalDamagedProducts}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Needs attention <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">
              From customer returns
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Returns</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {loading ? "..." : totalReturns}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingDown />
                -2.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Slightly down this month <IconTrendingDown className="size-4" />
            </div>
            <div className="text-muted-foreground">From customer returns</div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
