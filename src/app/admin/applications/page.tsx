import { Suspense } from "react";
import type { Metadata } from "next";
import { ApplicationsView } from "@/components/admin/applications/applications-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Staff Applications | CityFix Administration",
  description:
    "Review candidate applications, inspect qualifications and practical experience, and appoint Department Managers and Technicians.",
};

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <ApplicationsView />
    </Suspense>
  );
}
