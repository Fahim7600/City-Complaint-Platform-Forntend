"use client";

import * as React from "react";
import { AlertCircle, Clock, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format-date";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface SlaCountdownCardProps {
  complaint: Complaint;
}

function computeTimeDiff(targetDate: Date) {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const totalMinutes = Math.floor(absDiff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let text = "";
  if (days > 0) {
    text = `${days}d ${hours}h`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes}m`;
  } else {
    text = `${minutes}m`;
  }

  return { isOverdue, text, diffMs };
}

export function SlaCountdownCard({ complaint }: SlaCountdownCardProps) {
  // Hidden once RESOLVED, CLOSED, or CANCELLED
  const isCompletedStatus =
    complaint.status === ComplaintStatus.RESOLVED ||
    complaint.status === ComplaintStatus.CLOSED ||
    complaint.status === ComplaintStatus.CANCELLED;

  const [timeState, setTimeState] = React.useState(() =>
    complaint.slaDueAt ? computeTimeDiff(new Date(complaint.slaDueAt)) : null
  );

  React.useEffect(() => {
    if (!complaint.slaDueAt || isCompletedStatus) return;

    const target = new Date(complaint.slaDueAt);
    const update = () => setTimeState(computeTimeDiff(target));

    update();
    const interval = setInterval(update, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [complaint.slaDueAt, isCompletedStatus]);

  if (isCompletedStatus || !complaint.slaDueAt || !timeState) {
    return null;
  }

  const { isOverdue, text } = timeState;

  return (
    <Card
      className={cn(
        "overflow-hidden border transition-all duration-300",
        isOverdue
          ? "border-rose-500/40 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
          : "border-teal-500/30 bg-teal-500/5 shadow-sm"
      )}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl border",
              isOverdue
                ? "border-rose-500/40 bg-rose-500 text-white shadow-sm"
                : "border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400"
            )}
          >
            {isOverdue ? (
              <AlertCircle className="size-5 animate-pulse" />
            ) : (
              <Timer className="size-5" />
            )}
          </div>

          <div className="space-y-0.5">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                isOverdue ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
              )}
            >
              {isOverdue ? "SLA Overdue" : "Target SLA Due Date"}
            </span>
            <p className="text-xs text-muted-foreground">
              Target completion:{" "}
              <strong className="text-foreground">
                {formatDateTime(complaint.slaDueAt)}
              </strong>
            </p>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-heading text-sm font-bold border self-start sm:self-auto",
            isOverdue
              ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30"
              : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30"
          )}
        >
          <Clock className="size-4 shrink-0" />
          <span>{isOverdue ? `Overdue by ${text}` : `Due in ${text}`}</span>
        </div>
      </CardContent>
    </Card>
  );
}
