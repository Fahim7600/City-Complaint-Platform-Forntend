// TEMP: Technician Portal Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Technician Portal",
  description: "Technician portal for assigned work orders and service resolutions.",
};

export default function TechnicianPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TempRoleDashboard expectedRole="TECHNICIAN" title="Technician Portal" />
    </Suspense>
  );
}
