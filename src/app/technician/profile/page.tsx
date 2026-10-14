import { Suspense } from "react";
import type { Metadata } from "next";
import { TechnicianProfileView } from "@/components/technician/profile-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Profile & Availability",
  description: "Manage your technician profile credentials, dispatch availability, and authentication security.",
};

export default function TechnicianProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <TechnicianProfileView />
    </Suspense>
  );
}
