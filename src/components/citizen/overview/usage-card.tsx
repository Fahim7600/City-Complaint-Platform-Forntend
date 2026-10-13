"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowUpRight, Crown, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export function UsageCard() {
  const { data: usage, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.complaints.usage(),
    queryFn: complaintService.getUsage,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error("Failed to load monthly complaint quota usage.");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Card>
    );
  }

  if (isError || !usage) {
    return (
      <Card className="border border-destructive/30 bg-destructive/5 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <AlertCircle className="size-4" />
              Unable to load monthly usage
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

  const numericLimit = typeof usage.limit === "number" ? usage.limit : 5;
  const isUnlimited = usage.limit === "unlimited" || usage.limit === "UNLIMITED";
  const percent = isUnlimited ? 0 : Math.min(100, Math.round((usage.used / numericLimit) * 100));
  const isAtLimit = !isUnlimited && usage.used >= numericLimit;

  return (
    <Card className="relative overflow-hidden border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      {/* Subtle top indicator bar */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 transition-all duration-500",
          isAtLimit
            ? "bg-rose-500"
            : usage.isPremium
            ? "bg-gradient-to-r from-amber-400 to-amber-600"
            : "bg-teal-500"
        )}
      />

      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border",
                usage.isPremium
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                  : "border-teal-500/30 bg-teal-500/10 text-teal-500"
              )}
            >
              <Zap className="size-4" />
            </div>
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Monthly Usage
            </h3>
          </div>

          {usage.isPremium ? (
            <Badge
              variant="outline"
              className="border-amber-400/40 bg-amber-400/10 text-amber-500 dark:text-amber-300 font-semibold text-[11px] px-2.5 py-0.5 gap-1 shadow-sm"
            >
              <Crown className="size-3 text-amber-500 fill-amber-500" />
              Premium Member
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground border-border/70 bg-muted/30"
            >
              Free Tier
            </Badge>
          )}
        </div>

        {/* Counter */}
        <div className="space-y-1">
          <div className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {usage.used}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of {isUnlimited ? "∞" : numericLimit} complaints used this month
            </span>
          </div>
          {isAtLimit && (
            <p className="text-xs font-medium text-rose-500">
              Monthly limit reached. Upgrade to submit more complaints.
            </p>
          )}
        </div>

        {/* Custom Progress Bar: Teal turning Red at 100% */}
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isAtLimit ? "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]"
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{percent}% consumed</span>
            <span>Resets on {formatDate(usage.resetsAt)}</span>
          </div>
        </div>

        {/* Upgrade link for non-premium */}
        {!usage.isPremium && (
          <div className="pt-2 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Need higher filing limits?
            </span>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Upgrade to Premium
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
