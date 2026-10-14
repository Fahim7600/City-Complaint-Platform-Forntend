"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Copy,
  Crown,
  ExternalLink,
  Flame,
  Loader2,
  MapPin,
  Play,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { CategoryIcon } from "./category-icon";
import { QueueSlaChip } from "@/components/manager/queue-sla-chip";
import { formatRelativeTime } from "@/lib/format-date";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Complaint;
  onStartWork?: (jobId: string) => Promise<void> | void;
  isStarting?: boolean;
}

export function JobCard({ job, onStartWork, isStarting = false }: JobCardProps) {
  const router = useRouter();

  const handleCopyId = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(job.id);
    toast.success("Job ID copied");
  };

  const handleStartWork = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStartWork) {
      await onStartWork(job.id);
    }
  };

  const isAssigned = job.status === ComplaintStatus.ASSIGNED;
  const isPremiumCitizen = Boolean(job.citizen?.isPremium);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    job.location
  )}`;

  return (
    <Card
      onClick={() => router.push(`/technician/jobs/${job.id}`)}
      className={cn(
        "group relative cursor-pointer overflow-hidden transition-all duration-300",
        "border border-border/70 bg-card/60 backdrop-blur-sm",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40",
        job.isEscalated && "border-rose-500/40 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.08)]"
      )}
    >
      {/* Top subtle glow bar */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          job.isEscalated
            ? "bg-gradient-to-r from-transparent via-rose-500 to-transparent"
            : "bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        )}
      />

      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {/* Row 1: ID, Badges, SLA Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
              #{job.id.slice(0, 8)}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              title="Copy Job ID"
              aria-label="Copy Job ID"
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Copy className="size-3" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
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
        </div>

        {/* Row 2: Category Icon + Title */}
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 group-hover:scale-110 transition-transform duration-300">
            <CategoryIcon name={job.category?.name} className="size-4.5" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-heading text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          </div>
        </div>

        {/* Row 3: Location with Maps link + SLA Chip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/50 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate font-medium text-foreground">{job.location}</span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open location in Google Maps"
              className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:underline ml-1 shrink-0"
            >
              <span>Maps</span>
              <ExternalLink className="size-2.5" />
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <QueueSlaChip slaDueAt={job.slaDueAt} status={job.status} />
          </div>
        </div>

        {/* Row 4: Assigned Time + Quick Action Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            Assigned {formatRelativeTime(job.createdAt)}
          </span>

          {isAssigned && (
            <Button
              size="sm"
              onClick={handleStartWork}
              disabled={isStarting}
              className="text-xs font-bold h-7.5 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20 transition-all duration-200"
            >
              {isStarting ? (
                <>
                  <Loader2 className="size-3 animate-spin mr-1.5" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="size-3 mr-1 fill-current" />
                  Start work
                </>
              )}
            </Button>
          )}

          {!isAssigned && (
            <span className="text-xs text-primary font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View job <ArrowRight className="size-3" />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
