"use client";

import * as React from "react";
import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { CardGridSkeleton } from "@/components/shared/skeletons";
import { useAuth } from "@/hooks/use-auth";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { ComplaintStatus } from "@/types/complaint";
import { UsageCard } from "./usage-card";
import { RecentComplaints } from "./recent-complaints";
import { PremiumUpsellCard } from "./premium-upsell-card";

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  let timeOfDay = "day";
  if (hour < 12) {
    timeOfDay = "morning";
  } else if (hour < 18) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "evening";
  }

  const firstName = name ? name.trim().split(" ")[0] : "Citizen";
  return `Good ${timeOfDay}, ${firstName}`;
}

export function CitizenOverview() {
  const { user } = useAuth();

  // Also query usage to know if user is premium for the upsell banner
  const { data: usage } = useQuery({
    queryKey: queryKeys.complaints.usage(),
    queryFn: complaintService.getUsage,
  });

  const isPremium = Boolean(user?.isPremium || usage?.isPremium);

  // 4 Stat queries run in parallel via useQueries
  const statQueries = useQueries({
    queries: [
      {
        queryKey: queryKeys.complaints.list({ limit: 1 }),
        queryFn: () => complaintService.getMy({ limit: 1 }),
      },
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

  const isStatsLoading = statQueries.some((q) => q.isLoading);
  const isStatsError = statQueries.some((q) => q.isError);

  React.useEffect(() => {
    if (isStatsError) {
      toast.error("Failed to load some complaint statistics.");
    }
  }, [isStatsError]);

  const totalComplaints =
    statQueries[0].data?.total ??
    (statQueries[0].data as unknown as { meta?: { total?: number } })?.meta?.total ??
    0;
  const pendingCount =
    statQueries[1].data?.total ??
    (statQueries[1].data as unknown as { meta?: { total?: number } })?.meta?.total ??
    0;
  const inProgressCount =
    statQueries[2].data?.total ??
    (statQueries[2].data as unknown as { meta?: { total?: number } })?.meta?.total ??
    0;
  const resolvedCount =
    statQueries[3].data?.total ??
    (statQueries[3].data as unknown as { meta?: { total?: number } })?.meta?.total ??
    0;

  const handleRetryStats = () => {
    for (const q of statQueries) {
      q.refetch();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Greeting Header & Neon Action Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {getGreeting(user?.name)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your open civic complaints, follow repair progress, and inspect municipal response times.
          </p>
        </div>

        <Link href="/dashboard/complaints/new" className="shrink-0">
          <Button
            size="lg"
            className={
              "relative overflow-hidden font-semibold transition-all duration-300 " +
              "bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white " +
              "shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-[1.02] active:scale-[0.98]"
            }
          >
            <Plus className="size-5 mr-2" />
            File a complaint
          </Button>
        </Link>
      </div>

      {/* 4 StatCards Section */}
      <section aria-label="Complaint Statistics" className="space-y-3">
        {isStatsError ? (
          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-sm">
            <div className="flex items-center gap-2 text-destructive font-medium">
              <AlertCircle className="size-4" />
              Failed to load some complaint stats
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryStats}
              className="text-xs h-8"
            >
              <RefreshCw className="size-3 mr-1.5" />
              Retry
            </Button>
          </div>
        ) : null}

        {isStatsLoading ? (
          <CardGridSkeleton count={4} columns={4} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={FileText}
              label="Total Complaints"
              value={totalComplaints}
              iconColor="primary"
              description="All time filed complaints"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={pendingCount}
              iconColor="amber"
              description="Awaiting assignment"
            />
            <StatCard
              icon={Wrench}
              label="In Progress"
              value={inProgressCount}
              iconColor="blue"
              description="Technicians active"
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolved"
              value={resolvedCount}
              iconColor="violet"
              description="Successfully closed"
            />
          </div>
        )}
      </section>

      {/* Grid: Monthly Usage & Premium Upsell */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <UsageCard />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!isPremium && <PremiumUpsellCard />}
          <RecentComplaints />
        </div>
      </section>
    </div>
  );
}
