"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Send,
  Star,
  Trash2,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DepartmentTechnician } from "@/types/department";
import type { Complaint } from "@/types/complaint";
import { ComplaintStatus } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  technician: DepartmentTechnician;
  departmentComplaints?: Complaint[];
  onClick: () => void;
  onResendInvite?: (technician: DepartmentTechnician) => void;
  onRemove?: (technician: DepartmentTechnician) => void;
  isResending?: boolean;
}

export function TeamCard({
  technician,
  departmentComplaints = [],
  onClick,
  onResendInvite,
  onRemove,
  isResending,
}: TeamCardProps) {
  // Compute active & completed jobs from department complaints
  const techComplaints = React.useMemo(() => {
    return departmentComplaints.filter(
      (c) => c.assignedTechnicianId === technician.id
    );
  }, [departmentComplaints, technician.id]);

  const activeJobs = techComplaints.filter(
    (c) =>
      c.status === ComplaintStatus.ASSIGNED ||
      c.status === ComplaintStatus.IN_PROGRESS
  ).length;

  const completedJobs = techComplaints.filter(
    (c) =>
      c.status === ComplaintStatus.RESOLVED ||
      c.status === ComplaintStatus.CLOSED
  ).length;

  const initials = technician.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isInvitePending = Boolean(
    technician.invitePending || technician.mustChangePassword
  );

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer relative overflow-hidden transition-all duration-300",
        "border border-border/70 bg-card/60 backdrop-blur-sm",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-500/40 flex flex-col justify-between"
      )}
    >
      {/* Top subtle glow bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Header: Avatar, Name, Availability & Badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-12 rounded-2xl border-2 border-violet-500/20 shadow-sm group-hover:border-violet-500/40 transition-colors">
                {technician.avatarUrl && (
                  <AvatarImage
                    src={technician.avatarUrl}
                    alt={technician.name}
                  />
                )}
                <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-0.5">
                <h3 className="font-heading text-sm font-bold text-foreground truncate group-hover:text-violet-500 transition-colors">
                  {technician.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                  <Wrench className="size-3 text-muted-foreground/80 shrink-0" />
                  Field Technician
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {isInvitePending && (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold"
                >
                  Invite pending
                </Badge>
              )}
              {technician.isAvailable ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  Available
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-border/60 bg-muted/30 text-muted-foreground text-[10px] font-semibold"
                >
                  On leave
                </Badge>
              )}
            </div>
          </div>

          {/* Ratings and Experience / Email */}
          <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-background/50 border border-border/40">
            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-foreground">
                {technician.averageRating > 0
                  ? technician.averageRating.toFixed(1)
                  : "New"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({technician.reviewCount}{" "}
                {technician.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">
              {technician.email || technician.qualification || "Certified Tech"}
            </span>
          </div>

          {/* Stats Grid: Active Jobs vs Completed */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-background/40 border border-border/40 space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Clock className="size-3 text-violet-500" />
                Active Jobs
              </span>
              <p className="font-heading text-base font-extrabold text-foreground">
                {activeJobs}
              </p>
              <span className="text-[10px] text-muted-foreground">
                In progress
              </span>
            </div>

            <div className="p-3 rounded-xl bg-background/40 border border-border/40 space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" />
                Completed
              </span>
              <p className="font-heading text-base font-extrabold text-foreground">
                {completedJobs}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Resolved
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Resend Invite & Remove from team */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="pt-3 border-t border-border/50 flex items-center justify-between gap-2"
        >
          {isInvitePending && onResendInvite ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isResending}
              onClick={() => onResendInvite(technician)}
              className="text-xs h-8 px-2.5 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold"
            >
              <Send className="size-3 mr-1" />
              Resend invite
            </Button>
          ) : (
            <span className="text-[11px] text-muted-foreground/70">
              Department member
            </span>
          )}

          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onRemove(technician)}
              className="text-xs h-8 px-2.5 font-semibold ml-auto"
            >
              <Trash2 className="size-3 mr-1" />
              Remove from team
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
