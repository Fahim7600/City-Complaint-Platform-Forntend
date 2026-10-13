import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatTrend {
  value: number;
  label?: string;
  isNeutral?: boolean;
}

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: StatTrend;
  description?: string;
  className?: string;
  iconColor?: "primary" | "violet" | "amber" | "rose" | "blue";
}

const colorMap = {
  primary:
    "text-primary bg-primary/10 border-primary/20 group-hover:bg-primary/20",
  violet:
    "text-violet-500 bg-violet-500/10 border-violet-500/20 group-hover:bg-violet-500/20",
  amber:
    "text-amber-500 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20",
  rose:
    "text-rose-500 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20",
  blue:
    "text-blue-500 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  description,
  className,
  iconColor = "primary",
}: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : false;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border border-border/70 bg-card/60 backdrop-blur-sm",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30",
        className
      )}
    >
      {/* Subtle top glow bar on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
              {label}
            </p>
            <div className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {value}
            </div>
          </div>
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 shadow-sm",
              colorMap[iconColor]
            )}
          >
            <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>

        {(trend || description) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px]",
                  trend.isNeutral
                    ? "bg-muted text-muted-foreground"
                    : isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                )}
              >
                {!trend.isNeutral && (
                  <>
                    {isPositive ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                  </>
                )}
                {isPositive && !trend.isNeutral ? `+${trend.value}%` : `${trend.value}%`}
              </span>
            )}
            <span className="text-muted-foreground truncate">
              {trend?.label || description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "border border-border/70 bg-card/60 backdrop-blur-sm p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="size-12 rounded-2xl" />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-3 w-28" />
      </div>
    </Card>
  );
}

StatCard.Skeleton = StatCardSkeleton;
