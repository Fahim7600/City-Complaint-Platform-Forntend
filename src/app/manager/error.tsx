"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function ManagerError({
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
      title="Manager Portal Error"
      dashboardHref="/manager"
    />
  );
}
