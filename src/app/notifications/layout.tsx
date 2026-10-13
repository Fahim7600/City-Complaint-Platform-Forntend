import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const metadata: Metadata = {
  title: "Notifications | CityFix",
  description: "View and manage system updates, alerts, and complaint progress.",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Uses whatever role the user has dynamically
  return <DashboardShell>{children}</DashboardShell>;
}
