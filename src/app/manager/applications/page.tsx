import { Suspense } from "react";
import type { Metadata } from "next";
import { ApplicationsView } from "@/components/manager";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Staff Applications",
  description: "Review applicant qualifications and appoint candidate technicians to your department.",
};

export default function ManagerApplicationsPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <ApplicationsView />
    </Suspense>
  );
}
