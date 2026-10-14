"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Flame,
  Percent,
  Star,
  Timer,
  Wrench,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { TechnicianPerformance } from "@/types/stats";

interface PerformanceStatsProps {
  performance?: TechnicianPerformance | null;
  activeJobsCount?: number;
  onTimeRate?: number;
  isLoading?: boolean;
}

export function formatResolutionTime(hours: number): string {
  if (!hours || hours <= 0) return "N/A";
  if (hours < 1) {
    const mins = Math.max(1, Math.round(hours * 60));
    return `${mins}m`;
  }
  if (hours < 24) {
    return `${Math.round(hours)}h`;
  }
  const days = Math.floor(hours / 24);
  const remHours = Math.round(hours % 24);
  return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
}

export function PerformanceStats({
  performance,
  activeJobsCount = 0,
  onTimeRate = 100,
  isLoading = false,
}: PerformanceStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
      </div>
    );
  }

  const completed = performance?.totalResolved ?? 0;
  const rating = performance?.averageRating ?? 0;
  const reviews = performance?.reviewCount ?? 0;
  const resolutionTime = formatResolutionTime(
    performance?.averageResolutionHours ?? 0
  );
  const inProgress = performance?.inProgress ?? 0;
  const overdue = performance?.overdueCount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Jobs completed */}
      <StatCard
        icon={CheckCircle2}
        iconColor="primary"
        label="Jobs Completed"
        value={completed}
        description="All-time resolved tickets"
      />

      {/* 2. Average rating */}
      <StatCard
        icon={Star}
        iconColor="amber"
        label="Average Rating"
        value={rating > 0 ? `${rating.toFixed(1)} ★` : "New ★"}
        description={reviews > 0 ? `${reviews} citizen rating${reviews > 1 ? "s" : ""}` : "No reviews yet"}
      />

      {/* 3. Average resolution time */}
      <StatCard
        icon={Timer}
        iconColor="blue"
        label="Avg Resolution Time"
        value={resolutionTime}
        description="Ticket opened to resolved"
      />

      {/* 4. On-time SLA rate */}
      <StatCard
        icon={Percent}
        iconColor="violet"
        label="SLA Met Rate"
        value={`${onTimeRate}%`}
        description={overdue > 0 ? `${overdue} overdue ticket${overdue > 1 ? "s" : ""}` : "All SLAs on schedule"}
      />

      {/* 5. Active jobs */}
      <StatCard
        icon={Wrench}
        iconColor="violet"
        label="Active Jobs"
        value={activeJobsCount > 0 ? activeJobsCount : inProgress}
        description="Assigned & in-progress"
      />
    </div>
  );
}
