import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Department Manager - CityFix",
    default: "Manager Portal | CityFix",
  },
  description: "Department Manager portal for triaging complaints and supervising staff.",
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="MANAGER">{children}</DashboardShell>;
}
