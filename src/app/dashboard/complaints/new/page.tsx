import { Suspense } from "react";
import type { Metadata } from "next";
import { NewComplaintWizard } from "@/components/citizen/new-complaint";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "File a Complaint",
  description: "Report an issue, upload evidence, and dispatch city repair teams via CityFix.",
};

export default function NewComplaintPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <NewComplaintWizard />
    </Suspense>
  );
}
