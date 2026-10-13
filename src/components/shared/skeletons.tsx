import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden",
        className
      )}
    >
      <div className="border-b border-border/70 bg-muted/40 p-4">
        <div className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`header-col-${i}`}
              className={cn("h-4", i === 0 ? "w-28" : "w-20")}
            />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={`row-${rIdx}`}
            className="flex items-center gap-4 p-4 animate-pulse"
          >
            {Array.from({ length: columns }).map((_, cIdx) => (
              <Skeleton
                key={`cell-${rIdx}-${cIdx}`}
                className={cn(
                  "h-5",
                  cIdx === 0
                    ? "w-36"
                    : cIdx === columns - 1
                    ? "w-16 ml-auto"
                    : "w-24"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface CardGridSkeletonProps {
  count?: number;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function CardGridSkeleton({
  count = 4,
  className,
  columns = 4,
}: CardGridSkeletonProps) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid grid-cols-1 gap-4", colClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={`card-skel-${i}`}
          className="border border-border/70 bg-card/60 backdrop-blur-sm p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="size-12 rounded-2xl" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export interface PageSkeletonProps {
  hasStats?: boolean;
  statCount?: number;
  className?: string;
}

export function PageSkeleton({
  hasStats = true,
  statCount = 4,
  className,
}: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-1", className)}>
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:w-64" />
          <Skeleton className="h-4 w-60 sm:w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Stats cards row */}
      {hasStats && <CardGridSkeleton count={statCount} />}

      {/* Content table skeleton */}
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        <TableSkeleton rows={5} columns={5} />
      </Card>
    </div>
  );
}
