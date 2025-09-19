"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSettings,
  IconShoppingCart,
  IconUsers,
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
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Petugas",
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
      title: "Pelanggan",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Laporan",
      url: "#",
      icon: IconReport,
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
          title: "Basket",
          url: "#",
        },
        {
          title: "Bulu Tangkis",
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
  navSecondary: [
    {
      title: "Pengaturan",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Data Produk",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Laporan Penjualan",
      url: "#",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SportZone</span>
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
    </Sidebar>
  )
}
