"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function AdminComplaintDetailError({
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
      title="Admin Complaint Detail Error"
      dashboardHref="/admin/complaints"
    />
  );
}
