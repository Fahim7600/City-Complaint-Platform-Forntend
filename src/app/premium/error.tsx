"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function PremiumError({
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
      title="Premium Processing Error"
      dashboardHref="/dashboard/subscription"
    />
  );
}
