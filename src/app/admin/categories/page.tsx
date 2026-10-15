import { Suspense } from "react";
import type { Metadata } from "next";
import { CategoriesView } from "@/components/admin/categories/categories-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Service Categories | CityFix Administration",
  description:
    "Manage municipal complaint categories, SLA resolution timelines, and departmental incident routing.",
};

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <CategoriesView />
    </Suspense>
  );
}
