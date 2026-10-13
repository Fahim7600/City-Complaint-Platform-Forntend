// TEMP: Citizen Dashboard Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Citizen Dashboard",
  description: "Citizen portal for filing complaints and tracking municipal services.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TempRoleDashboard expectedRole="CITIZEN" title="Citizen Dashboard" />
    </Suspense>
  );
}
