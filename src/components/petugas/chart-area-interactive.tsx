"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

// Updated chart data to be more sports-themed
const chartData = [
  { date: "2024-04-01", sepatu: 222, bola: 150, raket: 120 },
  { date: "2024-04-02", sepatu: 97, bola: 180, raket: 110 },
  { date: "2024-04-03", sepatu: 167, bola: 120, raket: 140 },
  { date: "2024-04-04", sepatu: 242, bola: 260, raket: 180 },
  { date: "2024-04-05", sepatu: 373, bola: 290, raket: 210 },
  { date: "2024-04-06", sepatu: 301, bola: 340, raket: 250 },
  { date: "2024-04-07", sepatu: 245, bola: 180, raket: 190 },
  { date: "2024-04-08", sepatu: 409, bola: 320, raket: 280 },
  { date: "2024-04-09", sepatu: 59, bola: 110, raket: 90 },
  { date: "2024-04-10", sepatu: 261, bola: 190, raket: 160 },
  { date: "2024-04-11", sepatu: 327, bola: 350, raket: 310 },
  { date: "2024-04-12", sepatu: 292, bola: 210, raket: 180 },
  { date: "2024-04-13", sepatu: 342, bola: 380, raket: 320 },
  { date: "2024-04-14", sepatu: 137, bola: 220, raket: 190 },
  { date: "2024-04-15", sepatu: 120, bola: 170, raket: 150 },
  { date: "2024-04-16", sepatu: 138, bola: 190, raket: 160 },
  { date: "2024-04-17", sepatu: 446, bola: 360, raket: 310 },
  { date: "2024-04-18", sepatu: 364, bola: 410, raket: 350 },
  { date: "2024-04-19", sepatu: 243, bola: 180, raket: 160 },
  { date: "2024-04-20", sepatu: 89, bola: 150, raket: 120 },
  { date: "2024-04-21", sepatu: 137, bola: 200, raket: 170 },
  { date: "2024-04-22", sepatu: 224, bola: 170, raket: 140 },
  { date: "2024-04-23", sepatu: 138, bola: 230, raket: 190 },
  { date: "2024-04-24", sepatu: 387, bola: 290, raket: 250 },
  { date: "2024-04-25", sepatu: 215, bola: 250, raket: 210 },
  { date: "2024-04-26", sepatu: 75, bola: 130, raket: 110 },
  { date: "2024-04-27", sepatu: 383, bola: 420, raket: 360 },
  { date: "2024-04-28", sepatu: 122, bola: 180, raket: 150 },
  { date: "2024-04-29", sepatu: 315, bola: 240, raket: 200 },
  { date: "2024-04-30", sepatu: 454, bola: 380, raket: 320 },
  { date: "2024-05-01", sepatu: 165, bola: 220, raket: 180 },
  { date: "2024-05-02", sepatu: 293, bola: 310, raket: 260 },
  { date: "2024-05-03", sepatu: 247, bola: 190, raket: 160 },
  { date: "2024-05-04", sepatu: 385, bola: 420, raket: 350 },
  { date: "2024-05-05", sepatu: 481, bola: 390, raket: 330 },
  { date: "2024-05-06", sepatu: 498, bola: 520, raket: 450 },
  { date: "2024-05-07", sepatu: 388, bola: 300, raket: 260 },
  { date: "2024-05-08", sepatu: 149, bola: 210, raket: 180 },
  { date: "2024-05-09", sepatu: 227, bola: 180, raket: 150 },
  { date: "2024-05-10", sepatu: 293, bola: 330, raket: 280 },
  { date: "2024-05-11", sepatu: 335, bola: 270, raket: 230 },
  { date: "2024-05-12", sepatu: 197, bola: 240, raket: 200 },
  { date: "2024-05-13", sepatu: 197, bola: 160, raket: 140 },
  { date: "2024-05-14", sepatu: 448, bola: 490, raket: 420 },
  { date: "2024-05-15", sepatu: 473, bola: 380, raket: 330 },
  { date: "2024-05-16", sepatu: 338, bola: 400, raket: 350 },
  { date: "2024-05-17", sepatu: 499, bola: 420, raket: 360 },
  { date: "2024-05-18", sepatu: 315, bola: 350, raket: 300 },
  { date: "2024-05-19", sepatu: 235, bola: 180, raket: 150 },
  { date: "2024-05-20", sepatu: 177, bola: 230, raket: 190 },
  { date: "2024-05-21", sepatu: 82, bola: 140, raket: 120 },
  { date: "2024-05-22", sepatu: 81, bola: 120, raket: 100 },
  { date: "2024-05-23", sepatu: 252, bola: 290, raket: 240 },
  { date: "2024-05-24", sepatu: 294, bola: 220, raket: 180 },
  { date: "2024-05-25", sepatu: 201, bola: 250, raket: 210 },
  { date: "2024-05-26", sepatu: 213, bola: 170, raket: 140 },
  { date: "2024-05-27", sepatu: 420, bola: 460, raket: 390 },
  { date: "2024-05-28", sepatu: 233, bola: 190, raket: 160 },
  { date: "2024-05-29", sepatu: 78, bola: 130, raket: 110 },
  { date: "2024-05-30", sepatu: 340, bola: 280, raket: 240 },
  { date: "2024-05-31", sepatu: 178, bola: 230, raket: 190 },
  { date: "2024-06-01", sepatu: 178, bola: 200, raket: 170 },
  { date: "2024-06-02", sepatu: 470, bola: 410, raket: 350 },
  { date: "2024-06-03", sepatu: 103, bola: 160, raket: 130 },
  { date: "2024-06-04", sepatu: 439, bola: 380, raket: 320 },
  { date: "2024-06-05", sepatu: 88, bola: 140, raket: 120 },
  { date: "2024-06-06", sepatu: 294, bola: 250, raket: 210 },
  { date: "2024-06-07", sepatu: 323, bola: 370, raket: 310 },
  { date: "2024-06-08", sepatu: 385, bola: 320, raket: 270 },
  { date: "2024-06-09", sepatu: 438, bola: 480, raket: 410 },
  { date: "2024-06-10", sepatu: 155, bola: 200, raket: 170 },
  { date: "2024-06-11", sepatu: 92, bola: 150, raket: 130 },
  { date: "2024-06-12", sepatu: 492, bola: 420, raket: 360 },
  { date: "2024-06-13", sepatu: 81, bola: 130, raket: 110 },
  { date: "2024-06-14", sepatu: 426, bola: 380, raket: 320 },
  { date: "2024-06-15", sepatu: 307, bola: 350, raket: 290 },
  { date: "2024-06-16", sepatu: 371, bola: 310, raket: 260 },
  { date: "2024-06-17", sepatu: 475, bola: 520, raket: 450 },
  { date: "2024-06-18", sepatu: 107, bola: 170, raket: 140 },
  { date: "2024-06-19", sepatu: 341, bola: 290, raket: 240 },
  { date: "2024-06-20", sepatu: 408, bola: 450, raket: 380 },
  { date: "2024-06-21", sepatu: 169, bola: 210, raket: 180 },
  { date: "2024-06-22", sepatu: 317, bola: 270, raket: 230 },
  { date: "2024-06-23", sepatu: 480, bola: 530, raket: 460 },
  { date: "2024-06-24", sepatu: 132, bola: 180, raket: 150 },
  { date: "2024-06-25", sepatu: 141, bola: 190, raket: 160 },
  { date: "2024-06-26", sepatu: 434, bola: 380, raket: 320 },
  { date: "2024-06-27", sepatu: 448, bola: 490, raket: 420 },
  { date: "2024-06-28", sepatu: 149, bola: 200, raket: 170 },
  { date: "2024-06-29", sepatu: 103, bola: 160, raket: 130 },
  { date: "2024-06-30", sepatu: 446, bola: 400, raket: 340 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  sepatu: {
    label: "Sepatu",
    color: "var(--primary)",
  },
  bola: {
    label: "Bola",
    color: "var(--secondary)",
  },
  raket: {
    label: "Raket",
    color: "var(--muted)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Statistik Penjualan</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Penjualan berdasarkan kategori produk olahraga
          </span>
          <span className="@[540px]/card:hidden">Penjualan produk</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 bulan</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 bulan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                3 bulan
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 hari
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 hari
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSepatu" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sepatu)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sepatu)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBola" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bola)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bola)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRaket" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-raket)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-raket)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="raket"
              type="natural"
              fill="url(#fillRaket)"
              stroke="var(--color-raket)"
              stackId="a"
            />
            <Area
              dataKey="bola"
              type="natural"
              fill="url(#fillBola)"
              stroke="var(--color-bola)"
              stackId="a"
            />
            <Area
              dataKey="sepatu"
              type="natural"
              fill="url(#fillSepatu)"
              stroke="var(--color-sepatu)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
