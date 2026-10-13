import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Citizen Portal - CityFix",
    default: "Citizen Dashboard | CityFix",
  },
  description: "Citizen portal for filing complaints and tracking municipal services.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="CITIZEN">{children}</DashboardShell>;
}
