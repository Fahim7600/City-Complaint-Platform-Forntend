import { Suspense } from "react";
import type { Metadata } from "next";
import { AuditLogsView } from "@/components/admin/audit-logs/audit-logs-view";
import { PageSkeleton } from "@/components/shared/skeletons";

export const metadata: Metadata = {
  title: "Audit Log & System Activity | CityFix Administration",
  description:
    "Review immutable system audit trails, administrative mutations, role updates, and platform operational history.",
};

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<PageSkeleton hasStats={false} />}>
      <AuditLogsView />
    </Suspense>
  );
}
