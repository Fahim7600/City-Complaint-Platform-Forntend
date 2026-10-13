"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  FileQuestion,
  Plus,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { formatRelativeTime } from "@/lib/format-date";
import type { Complaint } from "@/types/complaint";
import { cn } from "@/lib/utils";

export function RecentComplaints() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.complaints.list({
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    queryFn: () =>
      complaintService.getMy({
        limit: 5,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });

  React.useEffect(() => {
    if (isError) {
      toast.error("Failed to load recent complaints.");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={`recent-skel-${i}`}
              className="border border-border/70 bg-card/60 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border border-destructive/30 bg-destructive/5 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertCircle className="size-4" />
              Unable to load recent complaints
            </div>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : "Network error"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs h-8"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const complaints: Complaint[] = data?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Recent Complaints
          </h2>
          <p className="text-xs text-muted-foreground">
            Your latest submitted tickets and their live status
          </p>
        </div>
        {complaints.length > 0 && (
          <Link
            href="/dashboard/complaints"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          icon={FileQuestion}
          title="No complaints filed yet"
          description="Have you spotted a pothole, street light outage, or civic issue? Report it to the city council in minutes."
          action={{
            label: "File your first complaint",
            href: "/dashboard/complaints/new",
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {complaints.map((item) => {
            const shortId = item.id.slice(0, 8);
            return (
              <Link
                key={item.id}
                href={`/dashboard/complaints/${item.id}`}
                className="group block"
              >
                <Card
                  className={cn(
                    "border border-border/70 bg-card/60 backdrop-blur-sm p-4 transition-all duration-300",
                    "hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 hover:bg-card/90"
                  )}
                >
                  <CardContent className="p-0 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                            #{shortId}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground truncate">
                            • {item.category?.name || "General"}
                          </span>
                        </div>
                        <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {item.isEscalated && <StatusBadge isEscalated size="sm" />}
                        <StatusBadge status={item.status} size="sm" />
                        <StatusBadge priority={item.priority} size="sm" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="size-3 text-muted-foreground" />
                          {item.department?.name || "Department unassigned"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3 text-muted-foreground" />
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Details
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
