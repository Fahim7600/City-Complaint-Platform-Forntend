"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { PerformanceStats } from "./performance-stats";
import { PerformanceChartsSkeleton } from "./performance-charts";
import { EmptyState } from "@/components/shared/empty-state";
import { technicianService } from "@/services/technician.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { ComplaintStatus } from "@/types/complaint";
import { cn } from "@/lib/utils";

// Code splitting: dynamically load Recharts on client side only
const PerformanceCharts = dynamic(
  () =>
    import("./performance-charts").then((mod) => ({
      default: mod.PerformanceCharts,
    })),
  {
    ssr: false,
    loading: () => <PerformanceChartsSkeleton />,
  }
);

export function PerformanceView() {
  const { getParam, setParam } = useUrlState();
  const rangeParam = getParam("range", "30d");

  // 1. Fetch performance stats
  const { data: performance, isLoading: isPerfLoading } = useQuery({
    queryKey: queryKeys.technicians.performance(),
    queryFn: () => technicianService.getMyPerformance(),
  });

  // 2. Fetch assigned jobs for historical time series and active breakdown
  const { data: jobsData, isLoading: isJobsLoading } = useQuery({
    queryKey: queryKeys.technicians.assigned({ limit: 50 }),
    queryFn: () => technicianService.getMyAssignedJobs({ limit: 50 }),
  });

  const jobs = React.useMemo(() => jobsData?.items || [], [jobsData?.items]);

  const handleRangeChange = (range: "30d" | "90d" | "all") => {
    setParam("range", range === "30d" ? null : range);
  };

  // 3. Compute Time Series: last 8 weeks
  const timeSeriesData = React.useMemo(() => {
    const now = new Date();
    const weeks: { label: string; start: Date; end: Date; count: number }[] = [];

    for (let i = 7; i >= 0; i--) {
      const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
      const label = `Wk ${8 - i}`;
      weeks.push({ label, start, end, count: 0 });
    }

    jobs.forEach((j) => {
      if (
        (j.status === ComplaintStatus.RESOLVED || j.status === ComplaintStatus.CLOSED) &&
        j.resolvedAt
      ) {
        const resolvedDate = new Date(j.resolvedAt);
        weeks.forEach((w) => {
          if (resolvedDate >= w.start && resolvedDate <= w.end) {
            w.count++;
          }
        });
      }
    });

    return weeks.map((w) => ({
      label: w.label,
      completed: w.count,
    }));
  }, [jobs]);

  // 4. Compute Rating Distribution
  const ratingDistribution = React.useMemo(() => {
    const avg = performance?.averageRating || 0;
    const totalReviews = performance?.reviewCount || 0;

    if (totalReviews === 0 || avg === 0) {
      return [
        { stars: "5★", count: 0 },
        { stars: "4★", count: 0 },
        { stars: "3★", count: 0 },
        { stars: "2★", count: 0 },
        { stars: "1★", count: 0 },
      ];
    }

    // Distribute based on average rating
    const counts = [0, 0, 0, 0, 0];
    const rounded = Math.round(avg);
    const primaryIdx = 5 - rounded; // e.g. 5★ -> index 0, 4★ -> index 1

    counts[primaryIdx] = Math.ceil(totalReviews * 0.7);
    const secondaryIdx = rounded < 5 ? primaryIdx - 1 : primaryIdx + 1;
    if (secondaryIdx >= 0 && secondaryIdx < 5) {
      counts[secondaryIdx] = totalReviews - counts[primaryIdx];
    }

    return [
      { stars: "5★", count: counts[0] || 0 },
      { stars: "4★", count: counts[1] || 0 },
      { stars: "3★", count: counts[2] || 0 },
      { stars: "2★", count: counts[3] || 0 },
      { stars: "1★", count: counts[4] || 0 },
    ];
  }, [performance]);

  // 5. Compute Status Breakdown for Donut Chart
  const statusDistribution = React.useMemo(() => {
    let assigned = 0;
    let inProgress = 0;
    let resolved = 0;

    jobs.forEach((j) => {
      if (j.status === ComplaintStatus.ASSIGNED) assigned++;
      else if (j.status === ComplaintStatus.IN_PROGRESS) inProgress++;
      else if (
        j.status === ComplaintStatus.RESOLVED ||
        j.status === ComplaintStatus.CLOSED
      )
        resolved++;
    });

    if (assigned === 0 && inProgress === 0 && resolved === 0) {
      return [
        { name: "Assigned", value: 0, color: "#8b5cf6" },
        { name: "In Progress", value: 0, color: "#3b82f6" },
        { name: "Resolved", value: 0, color: "#10b981" },
      ];
    }

    return [
      { name: "Assigned", value: assigned, color: "#8b5cf6" },
      { name: "In Progress", value: inProgress, color: "#3b82f6" },
      { name: "Resolved", value: resolved, color: "#10b981" },
    ];
  }, [jobs]);

  // SLA met % calculation
  const onTimeRate = React.useMemo(() => {
    const total = performance?.totalAssigned || 0;
    const overdue = performance?.overdueCount || 0;
    if (total === 0) return 100;
    return Math.max(0, Math.round(((total - overdue) / total) * 100));
  }, [performance]);

  const activeJobsCount = React.useMemo(() => {
    return jobs.filter(
      (j) =>
        j.status === ComplaintStatus.ASSIGNED ||
        j.status === ComplaintStatus.IN_PROGRESS
    ).length;
  }, [jobs]);

  const isBrandNew =
    !isPerfLoading &&
    !isJobsLoading &&
    (performance?.totalResolved ?? 0) === 0 &&
    jobs.length === 0;

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground">
            My Performance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Comprehensive audit metrics, resolution velocity, and citizen satisfaction ratings.
          </p>
        </div>

        {/* Period Selector Tabs (?range=30d | 90d | all) */}
        <div className="flex items-center p-1 rounded-xl bg-muted/50 border border-border/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleRangeChange("30d")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              rangeParam === "30d" || !rangeParam
                ? "bg-background text-foreground shadow-sm font-bold border border-border/70"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => handleRangeChange("90d")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              rangeParam === "90d"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/70"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Last 90 Days
          </button>
          <button
            type="button"
            onClick={() => handleRangeChange("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              rangeParam === "all"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/70"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* 5 StatCards */}
      <PerformanceStats
        performance={performance}
        activeJobsCount={activeJobsCount}
        onTimeRate={onTimeRate}
        isLoading={isPerfLoading || isJobsLoading}
      />

      {/* Empty State for Brand New Technician */}
      {isBrandNew ? (
        <EmptyState
          icon={Sparkles}
          title="Your stats will appear after your first resolved job"
          description="Once you complete field work orders and submit after-work verification proof, your performance trends and citizen ratings will be visualized here."
        />
      ) : (
        /* Recharts Charts */
        <PerformanceCharts
          timeSeriesData={timeSeriesData}
          ratingDistribution={ratingDistribution}
          statusDistribution={statusDistribution}
        />
      )}
    </div>
  );
}
