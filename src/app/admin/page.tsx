// TEMP: Platform Administrator Portal Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Administrator Portal",
  description: "Administrative console for municipal executive oversight and platform governance.",
};

export default function AdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TempRoleDashboard expectedRole="ADMIN" title="Administrator Portal" />
    </Suspense>
  );
}
