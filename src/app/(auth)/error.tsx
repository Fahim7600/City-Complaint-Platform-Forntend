"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function AuthError({
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
      title="Authentication Error"
      dashboardHref="/login"
    />
  );
}
