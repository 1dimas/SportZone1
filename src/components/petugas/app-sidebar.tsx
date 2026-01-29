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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const data = {
  user: {
    name: "Petugas",
    email: "petugas@sportzone.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Beranda",
      url: "/dashboardpetugas",
      icon: IconDashboard,
    },
    {
      title: "Produk",
      url: "/dashboardpetugas/produk",
      icon: IconDatabase,
    },
    {
      title: "Pesanan",
      url: "/dashboardpetugas/pesanan",
      icon: IconShoppingCart,
    },
    {
      title: "Pengembalian",
      url: "/dashboardpetugas/pengembalian",
      icon: IconPackageExport,
    },
    {
      title: "Produk Rusak",
      url: "/dashboardpetugas/produk-rusak",
      icon: IconAlertTriangle,
    },
  ],
  navClouds: [
    {
      title: "Kategori Olahraga",
      icon: IconFolder,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Sepak Bola",
          url: "#",
        },
        {
          title: "Bola Basket",
          url: "#",
        },
        {
          title: "Bulu Tangkis",
          url: "#",
        },
      ],
    },
    {
      title: "Merek",
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
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="relative bg-white border-r border-orange-100">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="#" className="flex items-center justify-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <IconUser className="!size-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-orange-600">Petugas</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="mt-auto pt-8 border-t border-orange-100">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
