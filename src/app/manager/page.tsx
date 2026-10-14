import { Suspense } from "react";
import type { Metadata } from "next";
import { QueueView } from "@/components/manager";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Department Queue",
  description: "Monitor and triage your department complaints queue, assign field technicians, and track SLA countdowns.",
};

export default function ManagerQueuePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <QueueView />
    </Suspense>
  );
}
