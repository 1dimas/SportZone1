"use client";

import dynamic from "next/dynamic";

const ChartAreaInteractive = dynamic(
  () => import("@/components/ChartAreaInteractive"),
  { ssr: false },
);

export default function ChartAreaWrapper() {
  return <ChartAreaInteractive />;
}
