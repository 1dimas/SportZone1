"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconBriefcase,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconPackageExport,
  IconAlertTriangle,
  IconUserShield,
  IconBox,
  IconTag,
  IconTrophy,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/admin/nav-documents"
import { NavMain } from "@/components/admin/nav-main"
import { NavSecondary } from "@/components/admin/nav-secondary"
import { NavUser } from "@/components/admin/nav-user"
import AdminDashboard from '../../app/dashboardadmin/page';
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
    name: "admin",
    email: "admin@sportzone.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboardadmin",
      icon: IconDashboard,
    },
    {
      title: "Pelanggan",
      url: "/dashboardadmin/customers",
      icon: IconListDetails,
    },
    {
      title: "Petugas",
      url: "/dashboardadmin/petugas",
      icon: IconUsers,
    },
    {
      title: "Olahraga",
      url: "/dashboardadmin/olahraga",
      icon: IconTrophy,
    },
    {
      title: "Brand",
      url: "/dashboardadmin/brand",
      icon: IconTag,
    },
    {
      title: "Banner",
      url: "/dashboardadmin/banner",
      icon: IconFileDescription,
    },
    {
      title: "Produk",
      url: "/dashboardadmin/produk",
      icon: IconBox,
    },
    {
      title: "Pesanan",
      url: "/dashboardadmin/pesanan",
      icon: IconListDetails,
    },
    {
      title: "Pengembalian",
      url: "/dashboardadmin/pengembalian",
      icon: IconPackageExport,
    },
    {
      title: "Produk Rusak",
      url: "/dashboardadmin/produk-rusak",
      icon: IconAlertTriangle,
    },
    {
      title: "Subkategori Peralatan",
      url: "/dashboardadmin/subkategori-peralatan",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Cari",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Laporan Produk",
      url: "/dashboardadmin/laporan-produk",
      icon: IconReport,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="relative">
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="#" className="flex items-center justify-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <IconUserShield className="!size-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-orange-600">Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />

      </SidebarContent>
      <SidebarFooter className="mt-auto pt-8 border-t border-gray-200">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
