import { Suspense } from "react";
import type { Metadata } from "next";
import { CitizenOverview } from "@/components/citizen/overview";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Citizen Overview",
  description: "Citizen dashboard overview with monthly usage, live statistics, and complaint tracking.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CitizenOverview />
    </Suspense>
  );
}
