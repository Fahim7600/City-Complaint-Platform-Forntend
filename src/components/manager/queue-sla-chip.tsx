"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComplaintStatus } from "@/types/complaint";

interface QueueSlaChipProps {
  slaDueAt: string | null;
  status: ComplaintStatus;
  className?: string;
}

export function QueueSlaChip({ slaDueAt, status, className }: QueueSlaChipProps) {
  const isTerminal =
    status === ComplaintStatus.RESOLVED ||
    status === ComplaintStatus.CLOSED ||
    status === ComplaintStatus.REJECTED ||
    status === ComplaintStatus.CANCELLED;

  if (isTerminal) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted/60 text-muted-foreground border border-border/50",
          className
        )}
      >
        <CheckCircle2 className="size-3 text-emerald-500" />
        Resolved
      </span>
    );
  }

  if (!slaDueAt) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/40",
          className
        )}
      >
        No SLA
      </span>
    );
  }

  const dueTime = new Date(slaDueAt).getTime();
  const now = Date.now();
  const diffMs = dueTime - now;

  // Overdue: past due date
  if (diffMs < 0) {
    const overdueHours = Math.max(1, Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60)));
    const overdueDays = Math.floor(overdueHours / 24);

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold",
          "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse",
          className
        )}
      >
        <AlertCircle className="size-3 text-rose-500 shrink-0" />
        {overdueDays > 0 ? `Overdue (${overdueDays}d)` : `Overdue (${overdueHours}h)`}
      </span>
    );
  }

  // Under 24h: amber warning
  if (diffMs < 24 * 60 * 60 * 1000) {
    const hoursLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
          "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
          className
        )}
      >
        <Clock className="size-3 text-amber-500 shrink-0" />
        {hoursLeft}h left
      </span>
    );
  }

  // More than 24h: green
  const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium",
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        className
      )}
    >
      <Clock className="size-3 text-emerald-500 shrink-0" />
      {daysLeft}d left
    </span>
  );
}
