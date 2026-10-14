import { Suspense } from "react";
import type { Metadata } from "next";
import { TeamView } from "@/components/manager";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Department Team",
  description: "View field technician availability, active assignments, and customer ratings.",
};

export default function ManagerTechniciansPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <TeamView />
    </Suspense>
  );
}
