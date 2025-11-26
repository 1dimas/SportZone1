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
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const data = {
  user: {
    name: "admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboardadmin",
      icon: IconDashboard,
    },
    {
      title: "Customer",
      url: "/dashboardadmin/customers",
      icon: IconListDetails,
    },
    {
      title: "Officer",
      url: "/dashboardadmin/petugas",
      icon: IconUsers,
    },
    {
      title: "Sports",
      url: "/dashboardadmin/olahraga",
      icon: IconTrophy,
    },
    {
      title: "Brand",
      url: "/dashboardadmin/brand",
      icon: IconTag,
    },
    {
      title: "Products",
      url: "/dashboardadmin/produk",
      icon: IconBox,
    },
    {
      title: "Orders",
      url: "/dashboardadmin/pesanan",
      icon: IconListDetails,
    },
    {
      title: "Returns",
      url: "/dashboardadmin/pengembalian",
      icon: IconPackageExport,
    },
    {
      title: "Damaged Products",
      url: "/dashboardadmin/produk-rusak",
      icon: IconAlertTriangle,
    },
    {
      title: "Equipment Subcategories",
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
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Product Report",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Sales Report",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

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
                      <IconUserShield className="!size-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Admin</span>
                  </>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <IconUserShield className="!size-6" />
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
