"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Star,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { QueueSlaChip } from "./queue-sla-chip";
import type { DepartmentTechnician } from "@/types/department";
import type { Complaint } from "@/types/complaint";
import { ComplaintStatus } from "@/types/complaint";

interface TeamSheetProps {
  technician: DepartmentTechnician | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentComplaints?: Complaint[];
}

export function TeamSheet({
  technician,
  open,
  onOpenChange,
  departmentComplaints = [],
}: TeamSheetProps) {
  if (!technician) return null;

  // Filter complaints assigned to this technician
  const assignedComplaints = departmentComplaints.filter(
    (c) => c.assignedTechnicianId === technician.id
  );

  const activeJobs = assignedComplaints.filter(
    (c) =>
      c.status === ComplaintStatus.ASSIGNED ||
      c.status === ComplaintStatus.IN_PROGRESS
  );

  const resolvedJobs = assignedComplaints.filter(
    (c) =>
      c.status === ComplaintStatus.RESOLVED ||
      c.status === ComplaintStatus.CLOSED
  );

  const initials = technician.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl sm:w-[540px] h-full overflow-y-auto p-6 space-y-6"
      >
        <SheetHeader className="space-y-4 pb-4 border-b border-border/50 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-14 rounded-2xl border-2 border-violet-500/20 shadow-md">
                {technician.avatarUrl && (
                  <AvatarImage
                    src={technician.avatarUrl}
                    alt={technician.name}
                  />
                )}
                <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-bold text-base">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <SheetTitle className="text-lg font-bold text-foreground">
                  {technician.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Municipal Department Field Technician
                </SheetDescription>
              </div>
            </div>

            <div>
              {technician.isAvailable ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  Available
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold"
                >
                  On leave
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-center space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Rating
              </span>
              <p className="font-heading text-sm font-bold text-amber-500 flex items-center justify-center gap-1">
                <Star className="size-3.5 fill-amber-500" />
                {technician.averageRating > 0
                  ? technician.averageRating.toFixed(1)
                  : "New"}
              </p>
              <span className="text-[10px] text-muted-foreground">
                {technician.reviewCount} ratings
              </span>
            </div>

            <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-center space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Active
              </span>
              <p className="font-heading text-sm font-bold text-foreground">
                {activeJobs.length}
              </p>
              <span className="text-[10px] text-muted-foreground">
                In progress
              </span>
            </div>

            <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-center space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Resolved
              </span>
              <p className="font-heading text-sm font-bold text-foreground">
                {resolvedJobs.length}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Completed
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Qualification & Experience */}
        {(technician.qualification || technician.experience) && (
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 text-xs space-y-2">
            {technician.qualification && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <GraduationCap className="size-4 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Qualification: </span>
                  <span>{technician.qualification}</span>
                </div>
              </div>
            )}
            {technician.experience && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Briefcase className="size-4 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Experience: </span>
                  <span>{technician.experience}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Currently Assigned Active Complaints */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
              Currently Assigned Jobs ({activeJobs.length})
            </h4>
          </div>

          {activeJobs.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground space-y-1">
              <CheckCircle2 className="size-6 mx-auto text-emerald-500/70 mb-1" />
              <p className="font-semibold text-foreground">No active dispatches</p>
              <p className="text-[11px]">This technician is ready for new job assignments.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeJobs.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2 text-xs hover:border-violet-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-foreground line-clamp-1">
                      {complaint.title}
                    </span>
                    <QueueSlaChip
                      slaDueAt={complaint.slaDueAt}
                      status={complaint.status}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={complaint.status} />
                      <StatusBadge priority={complaint.priority} />
                    </div>

                    <Link
                      href={`/manager?id=${complaint.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      Open in Queue <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
