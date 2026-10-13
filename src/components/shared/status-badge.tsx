import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ComplaintStatus, Priority } from "@/types/complaint";

type StatusType = ComplaintStatus | keyof typeof ComplaintStatus;
type PriorityType = Priority | keyof typeof Priority;

export interface StatusBadgeProps {
  status?: StatusType | string;
  priority?: PriorityType | string;
  isEscalated?: boolean;
  className?: string;
  size?: "sm" | "md";
}

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  ASSIGNED: {
    label: "Assigned",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    dotClass: "bg-sky-500",
  },
  RESOLVED: {
    label: "Resolved",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  CLOSED: {
    label: "Closed",
    badgeClass:
      "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    dotClass: "bg-zinc-400",
  },
  REJECTED: {
    label: "Rejected",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass:
      "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  },
};

const priorityConfig: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  LOW: {
    label: "Low Priority",
    badgeClass:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
  MEDIUM: {
    label: "Medium Priority",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  HIGH: {
    label: "High Priority",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClass: "bg-rose-500 animate-pulse",
  },
};

export function StatusBadge({
  status,
  priority,
  isEscalated,
  className,
  size = "md",
}: StatusBadgeProps) {
  // If rendering an Escalated badge explicitly
  if (isEscalated) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "inline-flex items-center gap-1.5 font-medium border border-violet-500/30",
          "bg-violet-500/10 text-violet-600 dark:text-violet-300",
          "shadow-[0_0_12px_rgba(168,85,247,0.25)] transition-all duration-300",
          size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
          className
        )}
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-violet-500" />
        </span>
        Escalated
      </Badge>
    );
  }

  // If priority is given
  if (priority) {
    const key = String(priority).toUpperCase();
    const config = priorityConfig[key] || {
      label: priority,
      badgeClass: "bg-muted text-muted-foreground border-border",
      dotClass: "bg-muted-foreground",
    };

    return (
      <Badge
        variant="outline"
        className={cn(
          "inline-flex items-center gap-1.5 font-medium border",
          config.badgeClass,
          size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
          className
        )}
      >
        <span className={cn("size-1.5 rounded-full", config.dotClass)} />
        {config.label}
      </Badge>
    );
  }

  // If status is given
  if (status) {
    const key = String(status).toUpperCase();
    const config = statusConfig[key] || {
      label: status,
      badgeClass: "bg-muted text-muted-foreground border-border",
      dotClass: "bg-muted-foreground",
    };

    return (
      <Badge
        variant="outline"
        className={cn(
          "inline-flex items-center gap-1.5 font-medium border",
          config.badgeClass,
          size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
          className
        )}
      >
        <span className={cn("size-1.5 rounded-full", config.dotClass)} />
        {config.label}
      </Badge>
    );
  }

  return null;
}
