import { Suspense } from "react";
import type { Metadata } from "next";
import { UsersView } from "@/components/admin/users/users-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "User Management | CityFix Administration",
  description:
    "Manage civic accounts, departmental roles, staff assignments, and platform access.",
};

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <UsersView />
    </Suspense>
  );
}
