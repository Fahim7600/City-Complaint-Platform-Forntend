"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function TechnicianError({
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
      title="Technician Portal Error"
      dashboardHref="/technician"
    />
  );
}
