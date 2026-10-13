"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function DashboardError({
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
      title="Citizen Dashboard Error"
      dashboardHref="/dashboard"
    />
  );
}
