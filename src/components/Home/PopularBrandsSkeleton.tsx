"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PopularBrandsSkeleton() {
  return (
    <section className="mb-8">
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </section>
  )
}
