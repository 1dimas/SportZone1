import { IconTrendingDown, IconTrendingUp, IconCurrencyDollar, IconUsers, IconShoppingCart, IconChartBar } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconCurrencyDollar className="h-4 w-4" />
            Total Pendapatan
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp 1.250.000
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-500">
              <IconTrendingUp className="mr-1 h-3 w-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-500">
            Meningkat bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Dibandingkan bulan sebelumnya
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            Pelanggan Baru
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            123
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-500">
              <IconTrendingDown className="mr-1 h-3 w-3" />
              -5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-red-500">
            Menurun periode ini <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Perlu perhatian lebih
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconShoppingCart className="h-4 w-4" />
            Pesanan Masuk
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            456
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-500">
              <IconTrendingUp className="mr-1 h-3 w-3" />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-500">
            Performa bagus <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meningkat dari minggu lalu</div>
        </CardFooter>
      </Card>
      <Card className="@container/card hover:shadow-md transition-shadow">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <IconChartBar className="h-4 w-4" />
            Produk Terjual
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1.234
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-500">
              <IconTrendingUp className="mr-1 h-3 w-3" />
              +15.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-500">
            Meningkat pesat <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Melebihi target bulanan</div>
        </CardFooter>
      </Card>
    </div>
  )
}
