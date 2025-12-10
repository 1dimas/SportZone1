"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function HeroSliderSkeleton() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100">
      {/* Aspect ratio container for hero */}
      <div className="aspect-[16/9] md:aspect-[21/9]">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Navigation dots skeleton */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-2 w-8 rounded-full" />
        ))}
      </div>
    </div>
  )
}
