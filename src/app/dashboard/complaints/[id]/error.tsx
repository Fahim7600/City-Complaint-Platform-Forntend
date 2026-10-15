"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function CitizenComplaintDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RoleErrorCard
      error={error}
      reset={reset}
      title="Complaint Detail Error"
      dashboardHref="/dashboard/complaints"
    />
  );
}
