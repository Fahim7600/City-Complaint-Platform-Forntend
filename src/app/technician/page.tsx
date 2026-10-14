import { Suspense } from "react";
import type { Metadata } from "next";
import { JobsView } from "@/components/technician/jobs-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "My Assigned Jobs",
  description: "View and manage assigned civic service work orders and maintenance dispatches.",
};

export default function TechnicianPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <JobsView />
    </Suspense>
  );
}
