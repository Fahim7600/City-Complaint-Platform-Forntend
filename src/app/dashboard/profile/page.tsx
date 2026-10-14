import { Suspense } from "react";
import type { Metadata } from "next";
import { ProfileView } from "@/components/shared/profile";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Profile & Settings",
  description: "View and update your citizen profile, contact details, and password security.",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <ProfileView />
    </Suspense>
  );
}
