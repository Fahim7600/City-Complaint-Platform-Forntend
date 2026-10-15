"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function TechnicianJobDetailError({
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
      title="Job Detail Error"
      dashboardHref="/technician"
    />
  );
}
