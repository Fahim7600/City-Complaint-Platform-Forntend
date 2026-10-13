import { Suspense } from "react";
import type { Metadata } from "next";
import { ComplaintDetailView } from "@/components/citizen/complaint-detail";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Complaint Details",
  description: "View real-time resolution status, SLA countdown, technician dispatch, and lifecycle timeline.",
};

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <ComplaintDetailView id={id} />
    </Suspense>
  );
}
