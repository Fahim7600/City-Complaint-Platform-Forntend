"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Crown, Flame } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { QueueSlaChip } from "@/components/manager/queue-sla-chip";
import { formatDate } from "@/lib/format-date";
import type { Complaint } from "@/types/complaint";

interface JobDetailHeaderProps {
  job: Complaint;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const handleCopyId = () => {
    navigator.clipboard.writeText(job.id);
    toast.success("Job ID copied");
  };

  const isPremiumCitizen = Boolean(job.citizen?.isPremium);

  return (
    <div className="space-y-4 pb-4 border-b border-border/60">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/technician" />}
          className="h-8 px-2.5 -ml-2 text-xs font-semibold hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 mr-1" />
          Back to My Jobs
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
              #{job.id.slice(0, 8)}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              title="Copy Job ID"
              aria-label="Copy Job ID"
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Copy className="size-3.5" />
            </button>

            <StatusBadge status={job.status} />
            <StatusBadge priority={job.priority} />
            {job.isEscalated && <StatusBadge isEscalated />}
            {isPremiumCitizen && (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
                <Crown className="size-2.5 text-amber-500" />
                Premium Citizen
              </Badge>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold text-foreground tracking-tight">
            {job.title}
          </h1>

          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span>Assigned to you on {formatDate(job.createdAt)}</span>
            <span>•</span>
            <span className="font-medium text-foreground">
              {job.category?.name || "Civic Service"}
            </span>
          </p>
        </div>

        {/* SLA Countdown pill */}
        <div className="flex items-center gap-2 self-start bg-card/80 p-2.5 rounded-xl border border-border/70 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">
            Resolution SLA:
          </span>
          <QueueSlaChip slaDueAt={job.slaDueAt} status={job.status} />
        </div>
      </div>
    </div>
  );
}
