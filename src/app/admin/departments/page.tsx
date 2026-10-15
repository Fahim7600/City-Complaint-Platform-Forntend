import { Suspense } from "react";
import type { Metadata } from "next";
import { DepartmentsView } from "@/components/admin/departments/departments-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Department Management | CityFix Administration",
  description:
    "Manage municipal departments, service categories, technician rosters, and operational capacity.",
};

export default function AdminDepartmentsPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <DepartmentsView />
    </Suspense>
  );
}
