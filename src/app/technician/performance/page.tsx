import { Suspense } from "react";
import type { Metadata } from "next";
import { PerformanceView } from "@/components/technician/performance-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "My Performance",
  description: "Track resolution milestones, SLA timeliness, and citizen satisfaction ratings.",
};

export default function TechnicianPerformancePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PerformanceView />
    </Suspense>
  );
}
