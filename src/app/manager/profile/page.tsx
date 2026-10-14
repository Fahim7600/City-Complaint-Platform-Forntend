import { Suspense } from "react";
import type { Metadata } from "next";
import { ProfileView } from "@/components/shared/profile";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Manager Profile & Settings",
  description: "View and manage your department manager profile, contact details, and password security.",
};

export default function ManagerProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <ProfileView
        title="Manager Profile & Settings"
        description="Manage your municipal department manager credentials and authentication security."
      />
    </Suspense>
  );
}
