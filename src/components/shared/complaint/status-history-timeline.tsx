"use client";

import * as React from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  FileCheck2,
  RotateCcw,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/format-date";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import { cn } from "@/lib/utils";

export interface StatusHistoryTimelineProps {
  complaint: Complaint;
}

interface TimelineEvent {
  id: string;
  title: string;
  actor: string;
  date: string;
  note?: string | null;
  icon: React.ElementType;
  colorClass: string;
}

export function StatusHistoryTimeline({
  complaint,
}: StatusHistoryTimelineProps) {
  const events: TimelineEvent[] = React.useMemo(() => {
    const list: TimelineEvent[] = [];

    // 1. Initial creation
    list.push({
      id: "event-created",
      title: "Complaint Filed",
      actor: complaint.citizen?.name || "Citizen (Filer)",
      date: complaint.createdAt,
      note: "Ticket logged on city registry with initial PENDING status.",
      icon: FileCheck2,
      colorClass: "bg-blue-500 text-white",
    });

    // 2. Escalation if happened
    if (complaint.escalatedAt) {
      list.push({
        id: "event-escalated",
        title: "Complaint Escalated",
        actor: "Department Management / System",
        date: complaint.escalatedAt,
        note: complaint.escalationReason || "SLA urgency priority escalated to municipal director.",
        icon: AlertTriangle,
        colorClass: "bg-violet-600 text-white",
      });
    }

    // 3. Assigned
    if (complaint.assignedTechnicianId) {
      list.push({
        id: "event-assigned",
        title: "Technician Dispatched",
        actor: complaint.department?.name || "Municipal Department Manager",
        date: complaint.createdAt,
        note: `Assigned to field technician for inspection.`,
        icon: UserCheck,
        colorClass: "bg-blue-600 text-white",
      });
    }

    // 4. In Progress
    if (
      complaint.status === ComplaintStatus.IN_PROGRESS ||
      complaint.status === ComplaintStatus.RESOLVED ||
      complaint.status === ComplaintStatus.CLOSED
    ) {
      list.push({
        id: "event-in-progress",
        title: "Repair In Progress",
        actor: complaint.assignedTechnician?.name || "Assigned Technician",
        date: complaint.updatedAt,
        note: "On-site assessment and repair work underway.",
        icon: Wrench,
        colorClass: "bg-sky-500 text-white",
      });
    }

    // 5. Resolved
    if (complaint.resolvedAt) {
      list.push({
        id: "event-resolved",
        title: "Work Marked Resolved",
        actor: complaint.assignedTechnician?.name || "Field Technician",
        date: complaint.resolvedAt,
        note: "Defect repaired. Citizen review and verification window activated.",
        icon: CheckCircle2,
        colorClass: "bg-emerald-500 text-white",
      });
    }

    // 6. Reopened / Sent back
    if (complaint.reopenedAt) {
      list.push({
        id: "event-reopened",
        title: `Complaint Reopened (${complaint.reopenCount}x)`,
        actor: complaint.citizen?.name || "Citizen / Manager",
        date: complaint.reopenedAt,
        note: "Reopened for additional technician remediation.",
        icon: RotateCcw,
        colorClass: "bg-amber-500 text-white",
      });
    }

    // 7. Closed
    if (complaint.status === ComplaintStatus.CLOSED) {
      list.push({
        id: "event-closed",
        title: "Complaint Closed",
        actor: "Department Manager / System",
        date: complaint.updatedAt,
        note: "Resolution finalized and archived.",
        icon: CheckCircle2,
        colorClass: "bg-teal-600 text-white",
      });
    }

    // 8. Cancelled
    if (complaint.status === ComplaintStatus.CANCELLED) {
      list.push({
        id: "event-cancelled",
        title: "Complaint Cancelled",
        actor: complaint.citizen?.name || "Citizen",
        date: complaint.updatedAt,
        note: "Complaint was cancelled by the filer.",
        icon: Ban,
        colorClass: "bg-rose-500 text-white",
      });
    }

    // 9. Rejected
    if (complaint.status === ComplaintStatus.REJECTED) {
      list.push({
        id: "event-rejected",
        title: "Complaint Rejected",
        actor: complaint.department?.name || "Department Manager",
        date: complaint.updatedAt,
        note: "Issue evaluated as non-actionable or duplicate.",
        icon: XCircle,
        colorClass: "bg-rose-500 text-white",
      });
    }

    return list;
  }, [complaint]);

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <Clock className="size-4 text-violet-500" />
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Status History & Audit Trail
        </h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
        {events.map((event, index) => {
          const Icon = event.icon;
          const isLatest = index === events.length - 1;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Dot */}
              <div
                className={cn(
                  "absolute -left-6 top-0 flex size-5.5 items-center justify-center rounded-full ring-4 ring-background shadow-sm transition-transform duration-200 group-hover:scale-110",
                  event.colorClass
                )}
              >
                <Icon className="size-3" />
              </div>

              {/* Event Content */}
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4
                    className={cn(
                      "text-xs font-bold text-foreground",
                      isLatest && "text-primary"
                    )}
                  >
                    {event.title}
                  </h4>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(event.date)}
                  </span>
                </div>

                <p className="text-[11px] font-medium text-muted-foreground">
                  By: <strong className="text-foreground">{event.actor}</strong>
                </p>

                {event.note && (
                  <p className="text-xs text-muted-foreground/90 bg-muted/30 p-2.5 rounded-lg border border-border/40 mt-1.5 leading-relaxed">
                    {event.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
