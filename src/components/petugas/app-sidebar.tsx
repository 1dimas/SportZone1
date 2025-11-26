"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconReport,
  IconShoppingCart,
  IconUsers,
  IconPackageExport,
  IconAlertTriangle,
  IconUser,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/petugas/nav-documents"
import { NavMain } from "@/components/petugas/nav-main"
import { NavSecondary } from "@/components/petugas/nav-secondary"
import { NavUser } from "@/components/petugas/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const data = {
  user: {
    name: "Officer",
    email: "petugas@sportzone.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboardpetugas",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/dashboardpetugas/produk",
      icon: IconDatabase,
    },
    {
      title: "Orders",
      url: "/dashboardpetugas/pesanan",
      icon: IconShoppingCart,
    },
    {
      title: "Returns",
      url: "/dashboardpetugas/pengembalian",
      icon: IconPackageExport,
    },
    {
      title: "Damaged Products",
      url: "/dashboardpetugas/produk-rusak",
      icon: IconAlertTriangle,
    },
  ],
  navClouds: [
    {
      title: "Sports Category",
      icon: IconFolder,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Soccer",
          url: "#",
        },
        {
          title: "Basketball",
          url: "#",
        },
        {
          title: "Badminton",
          url: "#",
        },
      ],
    },
    {
      title: "Brand",
      icon: IconDatabase,
      url: "#",
      items: [
        {
          title: "Nike",
          url: "#",
        },
        {
          title: "Adidas",
          url: "#",
        },
        {
          title: "Puma",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  documents: [
    {
      name: "Product Report",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Sales Report",
      url: "#",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open, toggleSidebar } = useSidebar()
  
  return (
    <Sidebar collapsible="icon" {...props} className="relative">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="#" className={`flex items-center ${open ? 'justify-start gap-3' : 'justify-center'}`}>
                {open ? (
                  <>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <IconUser className="!size-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Office</span>
                  </>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <IconUser className="!size-6" />
                  </div>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      
      {/* Circular Toggle Button on Border */}
      <div className="absolute -right-4 top-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border bg-background shadow-md hover:bg-accent transition-all duration-200"
          onClick={toggleSidebar}
        >
          {open ? (
            <IconChevronsLeft className="h-4 w-4" />
          ) : (
            <IconChevronsRight className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </Sidebar>
  )
}
