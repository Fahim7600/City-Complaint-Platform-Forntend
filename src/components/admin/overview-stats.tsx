"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Hourglass,
  ShieldAlert,
  UserX,
  Users,
  Wrench,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { DashboardStats } from "@/types/stats";

interface OverviewStatsProps {
  stats: DashboardStats;
  escalatedCount?: number;
}

function extractCount(val: number | { _all: number } | undefined): number {
  if (typeof val === "number") return val;
  if (val && typeof val._all === "number") return val._all;
  return 0;
}

function normalizeCounts(
  input:
    | Array<{ role?: string; status?: string; _count: number | { _all: number } }>
    | Record<string, number>
    | undefined,
  field: "role" | "status"
): Record<string, number> {
  if (!input) return {};
  if (Array.isArray(input)) {
    const map: Record<string, number> = {};
    for (const item of input) {
      const key = item[field];
      if (key) {
        map[key] = extractCount(item._count);
      }
    }
    return map;
  }
  return input;
}

export function OverviewStats({ stats, escalatedCount = 0 }: OverviewStatsProps) {
  const statusMap = React.useMemo(
    () => normalizeCounts(stats.complaints.byStatus, "status"),
    [stats.complaints.byStatus]
  );

  const roleMap = React.useMemo(
    () => normalizeCounts(stats.users.byRole, "role"),
    [stats.users.byRole]
  );

  const totalComplaints = React.useMemo(() => {
    return Object.values(statusMap).reduce((acc, curr) => acc + curr, 0);
  }, [statusMap]);

  const openComplaints =
    (statusMap.PENDING || 0) +
    (statusMap.ASSIGNED || 0) +
    (statusMap.IN_PROGRESS || 0);

  const resolvedComplaints =
    (statusMap.RESOLVED || 0) + (statusMap.CLOSED || 0);

  const overdueComplaints = stats.complaints.overdue || 0;

  const totalCitizens = roleMap.CITIZEN || 0;
  const deactivatedUsers = stats.users.deactivated || 0;

  const totalRevenueUsd = stats.revenue?.totalCents
    ? stats.revenue.totalCents / 100
    : 0;

  const totalTechnicians = React.useMemo(() => {
    if (!stats.departments) return 0;
    return stats.departments.reduce(
      (acc, d) => acc + (d.technicianCount || 0),
      0
    );
  }, [stats.departments]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Total Complaints */}
      <StatCard
        label="Total complaints"
        value={totalComplaints}
        icon={FileText}
        iconColor="blue"
      />

      {/* 2. Open Workload */}
      <StatCard
        label="Active open"
        value={openComplaints}
        icon={Hourglass}
        iconColor="amber"
      />

      {/* 3. Resolved */}
      <StatCard
        label="Resolved & closed"
        value={resolvedComplaints}
        icon={CheckCircle2}
        iconColor="primary"
      />

      {/* 4. Overdue SLA */}
      <StatCard
        label="Overdue SLA"
        value={overdueComplaints}
        icon={Clock}
        iconColor="rose"
      />

      {/* 5. Escalated */}
      <StatCard
        label="Escalated tickets"
        value={escalatedCount}
        icon={ShieldAlert}
        iconColor="rose"
      />

      {/* 6. Citizens */}
      <StatCard
        label="Registered citizens"
        value={totalCitizens}
        icon={Users}
        iconColor="violet"
      />

      {/* 7. Field Technicians */}
      <StatCard
        label="Field technicians"
        value={totalTechnicians}
        icon={Wrench}
        iconColor="primary"
      />

      {/* 8. Deactivated accounts */}
      <StatCard
        label="Deactivated users"
        value={deactivatedUsers}
        icon={UserX}
        iconColor="primary"
      />

      {/* 9. Premium Revenue */}
      <StatCard
        label="Premium revenue"
        value={`$${totalRevenueUsd.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`}
        icon={DollarSign}
        iconColor="primary"
      />
    </div>
  );
}
