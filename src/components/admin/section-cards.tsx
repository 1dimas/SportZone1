"use client"

import { DashboardSectionCards } from "@/components/shared/dashboard-section-cards";

export function SectionCards() {
  return <DashboardSectionCards userRole="ADMIN" showPermissionWarning={true} />;
}
