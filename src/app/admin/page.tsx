import { Suspense } from "react";
import type { Metadata } from "next";
import { OverviewView } from "@/components/admin/overview-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "City Overview | CityFix Administration",
  description:
    "Executive civic operations dashboard, SLA telemetry, and department performance monitoring.",
};

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <OverviewView />
    </Suspense>
  );
}
