"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function AdminError({
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
      title="Admin Portal Error"
      dashboardHref="/admin"
    />
  );
}
