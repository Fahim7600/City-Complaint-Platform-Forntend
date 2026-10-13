"use client";

import { RoleErrorCard } from "@/components/shared/role-error-card";

export default function NotificationsError({
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
      title="Notifications Error"
      dashboardHref="/dashboard"
    />
  );
}
