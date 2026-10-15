"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function PaymentError({
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
      title="Payment Processing Error"
      dashboardHref="/dashboard/subscription"
    />
  );
}
