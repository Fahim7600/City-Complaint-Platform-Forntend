import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin Portal - CityFix",
    default: "Admin Portal | CityFix",
  },
  description: "CityFix system administration and municipal configuration portal.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}
