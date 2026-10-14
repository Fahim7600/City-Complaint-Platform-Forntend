"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewHeader } from "./overview-header";
import { OverviewStats } from "./overview-stats";
import { DepartmentPerformanceTable } from "./department-performance-table";
import { RecentEscalationsCard } from "./recent-escalations-card";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";

// Lazy-loaded dynamic charts with skeleton fallback for code splitting
const DynamicOverviewCharts = dynamic(
  () => import("./overview-charts").then((mod) => mod.OverviewCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-80 rounded-2xl border border-border/70 bg-card/40 animate-pulse p-6 space-y-4"
          >
            <div className="h-5 w-40 bg-muted/60 rounded" />
            <div className="h-4 w-28 bg-muted/40 rounded" />
            <div className="h-52 w-full bg-muted/20 rounded-xl" />
          </div>
        ))}
      </div>
    ),
  }
);

export function OverviewView() {
  // 1. Fetch dashboard statistics
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: queryKeys.admin.dashboardStats(),
    queryFn: () => adminService.getDashboardStats(),
    refetchInterval: 30000,
  });

  // 2. Fetch escalated complaints for badge and recent escalations card
  const {
    data: escalatedData,
    refetch: refetchEscalated,
  } = useQuery({
    queryKey: queryKeys.admin.escalatedComplaints({ limit: 5 }),
    queryFn: () => adminService.getEscalatedComplaints({ limit: 5 }),
    refetchInterval: 30000,
  });

  const escalatedCount = escalatedData?.total ?? 0;
  const recentEscalations = escalatedData?.items ?? [];

  if (isStatsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-card/60 rounded-2xl border border-border/60" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-28 bg-card/50 rounded-2xl border border-border/50" />
          ))}
        </div>
        <div className="h-80 bg-card/40 rounded-2xl border border-border/50" />
      </div>
    );
  }

  if (isStatsError || !stats) {
    return (
      <div className="py-24 text-center space-y-4">
        <AlertCircle className="size-10 text-rose-500 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-base font-bold text-foreground">
            Failed to load city overview telemetry
          </h2>
          <p className="text-xs text-muted-foreground">
            Could not retrieve dashboard statistics from the server.
          </p>
        </div>
        <Button
          onClick={() => {
            refetchStats();
            refetchEscalated();
          }}
          size="sm"
          className="text-xs font-semibold"
        >
          <RefreshCw className="size-3.5 mr-1.5" />
          Retry loading
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <OverviewHeader escalatedCount={escalatedCount} />

      {/* 2. StatCards */}
      <OverviewStats stats={stats} escalatedCount={escalatedCount} />

      {/* 3. Recharts Visualizations */}
      <DynamicOverviewCharts stats={stats} />

      {/* 4. Bottom Grid: Department Performance Table + Recent Escalations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DepartmentPerformanceTable departments={stats.departments || []} />
        </div>
        <div>
          <RecentEscalationsCard
            escalations={recentEscalations}
            totalCount={escalatedCount}
          />
        </div>
      </div>
    </div>
  );
}
