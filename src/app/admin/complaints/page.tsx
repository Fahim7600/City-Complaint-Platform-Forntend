import { Suspense } from "react";
import type { Metadata } from "next";
import { ComplaintsView } from "@/components/admin/complaints/complaints-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "All Complaints & Escalations | CityFix Administration",
  description:
    "Citywide complaint management, triage, technician reassignment, and SLA breach resolution.",
};

export default function AdminComplaintsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ComplaintsView />
    </Suspense>
  );
}
