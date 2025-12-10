"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SectionCardsSkeleton() {
  return (
    <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
