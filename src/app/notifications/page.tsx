import { Suspense } from "react";
import type { Metadata } from "next";
import { NotificationsView } from "@/components/notifications/notifications-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View and manage your platform updates, service activities, and system alerts.",
};

export default function NotificationsPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <NotificationsView />
    </Suspense>
  );
}
