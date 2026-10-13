// TEMP: Department Manager Portal Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Department Manager Portal",
  description: "Manager portal for complaint dispatching, triage, and SLA enforcement.",
};

export default function ManagerPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TempRoleDashboard expectedRole="MANAGER" title="Department Manager Portal" />
    </Suspense>
  );
}
