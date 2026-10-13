import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Technician Portal - CityFix",
    default: "Field Technician Portal | CityFix",
  },
  description: "Technician portal for managing assigned service jobs and field work.",
};

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="TECHNICIAN">{children}</DashboardShell>;
}
