import { Suspense } from "react";
import type { Metadata } from "next";
import { ApplyStaffView } from "@/components/citizen/apply-staff";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Apply as Staff",
  description: "Apply to become a municipal field technician or department manager on CityFix.",
};

export default function ApplyStaffPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <ApplyStaffView />
    </Suspense>
  );
}
