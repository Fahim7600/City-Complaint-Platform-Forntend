import { Suspense } from "react";
import type { Metadata } from "next";
import { JobDetailView } from "@/components/technician/job-detail-view";
import { PageSkeleton } from "@/components/shared/skeletons";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const shortId = id ? `#${id.slice(0, 8)}` : "Job";

  return {
    title: `Work Order ${shortId}`,
    description: `Technician detail view and repair execution for work order ${shortId}.`,
  };
}

export default async function TechnicianJobDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <JobDetailView id={id} />
    </Suspense>
  );
}
