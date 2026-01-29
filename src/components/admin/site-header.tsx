"use client"

import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-white">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="size-9 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          {state === "collapsed" ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
          <span className="sr-only">Buka/Tutup Sidebar</span>
        </Button>
        <div className="ml-auto flex items-center gap-2">
        </div>
      </div>
    </header>
  )
}
