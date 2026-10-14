"use client";

import * as React from "react";
import { CheckCircle2, Clock, Inbox, Star, Wrench } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { TechnicianPerformance } from "@/types/stats";

interface JobsStatsProps {
  performance?: TechnicianPerformance | null;
  assignedCount?: number;
  inProgressCount?: number;
  isLoading?: boolean;
}

export function JobsStats({
  performance,
  assignedCount = 0,
  inProgressCount = 0,
  isLoading = false,
}: JobsStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
        <StatCard.Skeleton />
      </div>
    );
  }

  const assigned = assignedCount;
  const inProgress = performance?.inProgress ?? inProgressCount;
  const resolved = performance?.totalResolved ?? 0;
  const rating = performance?.averageRating ?? 0;
  const reviews = performance?.reviewCount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Assigned (new) */}
      <StatCard
        icon={Inbox}
        iconColor="violet"
        label="Assigned (New)"
        value={assigned}
        description="Awaiting on-site start"
      />

      {/* 2. In progress */}
      <StatCard
        icon={Wrench}
        iconColor="blue"
        label="In Progress"
        value={inProgress}
        description="Active repair dispatches"
      />

      {/* 3. Resolved */}
      <StatCard
        icon={CheckCircle2}
        iconColor="primary"
        label="Resolved This Month"
        value={resolved}
        description="Successfully remediated"
      />

      {/* 4. Average rating (stars) */}
      <StatCard
        icon={Star}
        iconColor="amber"
        label="Average Rating"
        value={rating > 0 ? `${rating.toFixed(1)} ★` : "New ★"}
        description={reviews > 0 ? `Based on ${reviews} citizen reviews` : "No reviews yet"}
      />
    </div>
  );
}
