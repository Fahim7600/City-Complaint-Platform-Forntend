"use client";

import * as React from "react";
import { useQueries } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { ComplaintStatus } from "@/types/complaint";

export function QueueStats() {
  const [
    pendingQuery,
    assignedQuery,
    inProgressQuery,
    overdueQuery,
    resolvedQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.complaints.list({
          status: ComplaintStatus.PENDING,
          limit: 1,
        }),
        queryFn: () =>
          complaintService.getMy({
            status: ComplaintStatus.PENDING,
            limit: 1,
          }),
      },
      {
        queryKey: queryKeys.complaints.list({
          status: ComplaintStatus.ASSIGNED,
          limit: 1,
        }),
        queryFn: () =>
          complaintService.getMy({
            status: ComplaintStatus.ASSIGNED,
            limit: 1,
          }),
      },
      {
        queryKey: queryKeys.complaints.list({
          status: ComplaintStatus.IN_PROGRESS,
          limit: 1,
        }),
        queryFn: () =>
          complaintService.getMy({
            status: ComplaintStatus.IN_PROGRESS,
            limit: 1,
          }),
      },
      {
        queryKey: queryKeys.complaints.list({
          overdue: true,
          limit: 1,
        }),
        queryFn: () =>
          complaintService.getMy({
            overdue: true,
            limit: 1,
          }),
      },
      {
        queryKey: queryKeys.complaints.list({
          status: ComplaintStatus.RESOLVED,
          limit: 1,
        }),
        queryFn: () =>
          complaintService.getMy({
            status: ComplaintStatus.RESOLVED,
            limit: 1,
          }),
      },
    ],
  });

  const isLoading =
    pendingQuery.isLoading ||
    assignedQuery.isLoading ||
    inProgressQuery.isLoading ||
    overdueQuery.isLoading ||
    resolvedQuery.isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
      </div>
    );
  }

  const unassignedCount = pendingQuery.data?.total ?? 0;
  const inProgressCount =
    (assignedQuery.data?.total ?? 0) + (inProgressQuery.data?.total ?? 0);
  const overdueCount = overdueQuery.data?.total ?? 0;
  const resolvedCount = resolvedQuery.data?.total ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Unassigned / Pending */}
      <StatCard
        label="Unassigned"
        value={unassignedCount}
        icon={Inbox}
        iconColor="violet"
        description="Pending technician assignment"
      />

      {/* 2. In Progress (Assigned + Active) */}
      <StatCard
        label="In Progress"
        value={inProgressCount}
        icon={Clock}
        iconColor="primary"
        description="Active in field or assigned"
      />

      {/* 3. Overdue (Past SLA) */}
      <StatCard
        label="Overdue SLA"
        value={overdueCount}
        icon={AlertTriangle}
        iconColor={overdueCount > 0 ? "rose" : "amber"}
        description="Exceeded resolution SLA"
      />

      {/* 4. Resolved */}
      <StatCard
        label="Resolved"
        value={resolvedCount}
        icon={CheckCircle2}
        iconColor="primary"
        description="Successfully resolved tickets"
      />
    </div>
  );
}
