import { Suspense } from "react";
import type { Metadata } from "next";
import { ComplaintsListView } from "@/components/citizen/complaints-list";
import { TableSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "My Complaints",
  description: "View, filter, and track all municipal complaints submitted by you.",
};

export default function CitizenComplaintsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-20 w-1/3 bg-muted/40 animate-pulse rounded-xl" />
          <TableSkeleton rows={8} columns={6} />
        </div>
      }
    >
      <ComplaintsListView />
    </Suspense>
  );
}
