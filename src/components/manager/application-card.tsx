"use client";

import * as React from "react";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Mail,
  ShieldAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RejectApplicationDialog } from "./reject-application-dialog";
import { formatDate } from "@/lib/format-date";
import type { User } from "@/types/user";

interface ApplicationCardProps {
  application: User;
  departmentName?: string;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  isMutating?: boolean;
  isAdmin?: boolean;
  existingManagerName?: string | null;
}

export function ApplicationCard({
  application,
  departmentName = "Municipal Operations",
  onApprove,
  onReject,
  isMutating = false,
  isAdmin = false,
  existingManagerName,
}: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);

  const isTechnician = application.requestedRole === "TECHNICIAN";
  const isManager = application.requestedRole === "MANAGER";
  const isPending = application.approvalStatus === "PENDING";

  // Manager is only authorized to decide Technician applications in their department.
  // Admin is authorized to decide both Technician and Manager applications across all departments.
  const canDecide = isPending && (isAdmin || isTechnician);

  const initials = application.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasLongDetails =
    Boolean(application.experience && application.experience.length > 120) ||
    Boolean(application.qualification && application.qualification.length > 120);

  const targetDepartment =
    application.department?.name || departmentName || "Municipal Operations";

  return (
    <>
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:shadow-lg">
        <CardContent className="p-6 space-y-5">
          {/* Top Row: Applicant Profile & Role Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <Avatar className="size-12 rounded-2xl border-2 border-violet-500/20 shadow-sm shrink-0">
                {application.avatarUrl && (
                  <AvatarImage src={application.avatarUrl} alt={application.name} />
                )}
                <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {application.name}
                  </h3>
                  {application.requestedRole && (
                    <Badge
                      variant="outline"
                      className="border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[11px] gap-1"
                    >
                      {isTechnician ? (
                        <Wrench className="size-3" />
                      ) : (
                        <Briefcase className="size-3" />
                      )}
                      Applying as {application.requestedRole}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3 text-muted-foreground/80" />
                    {application.email}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3 text-muted-foreground/80" />
                    Applied {formatDate(application.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Application Status Badge */}
            <div className="self-start sm:self-auto shrink-0">
              {application.approvalStatus === "APPROVED" ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  Approved
                </Badge>
              ) : application.approvalStatus === "REJECTED" ? (
                <Badge
                  variant="destructive"
                  className="bg-destructive/15 text-destructive border border-destructive/30 text-xs font-semibold"
                >
                  Rejected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold"
                >
                  Pending Review
                </Badge>
              )}
            </div>
          </div>

          {/* Department Tag */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Assigned Department:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-background/80 border border-border/60 font-medium text-foreground">
              {targetDepartment}
            </span>
          </div>

          {/* Experience and Qualification Details */}
          {(application.qualification || application.experience) && (
            <div className="p-4 rounded-xl border border-border/50 bg-background/40 space-y-3 text-xs">
              {application.qualification && (
                <div className="space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <GraduationCap className="size-3.5 text-violet-500" />
                    Qualifications & Credentials
                  </span>
                  <p
                    className={
                      !isExpanded && hasLongDetails
                        ? "line-clamp-2 text-muted-foreground text-xs leading-relaxed"
                        : "text-muted-foreground text-xs leading-relaxed whitespace-pre-line"
                    }
                  >
                    {application.qualification}
                  </p>
                </div>
              )}

              {application.experience && (
                <div className="space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5 text-violet-500" />
                    Practical Experience
                  </span>
                  <p
                    className={
                      !isExpanded && hasLongDetails
                        ? "line-clamp-2 text-muted-foreground text-xs leading-relaxed"
                        : "text-muted-foreground text-xs leading-relaxed whitespace-pre-line"
                    }
                  >
                    {application.experience}
                  </p>
                </div>
              )}

              {hasLongDetails && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline pt-1"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="size-3" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="size-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Actions Bar on PENDING items */}
          {isPending && (
            <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {canDecide ? (
                <>
                  <span className="text-xs text-muted-foreground">
                    Action required: Review candidate credentials for {isManager ? "department manager" : "technician"} appointment.
                  </span>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Reject Button (Destructive) */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setRejectOpen(true)}
                      disabled={isMutating}
                      className="text-xs font-semibold"
                    >
                      <XCircle className="size-3.5 mr-1.5" />
                      Reject
                    </Button>

                    {/* Approve Button (Neon gradient) */}
                    <Button
                      size="sm"
                      onClick={() => setConfirmApproveOpen(true)}
                      disabled={isMutating}
                      className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="size-3.5 mr-1.5" />
                      Approve {isManager ? "Manager" : "Technician"}
                    </Button>
                  </div>
                </>
              ) : isManager ? (
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <ShieldAlert className="size-4 shrink-0" />
                    <span>Manager applications require municipal Administrator approval</span>
                  </div>
                  <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                    Requires Admin Approval
                  </Badge>
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Approval */}
      <ConfirmDialog
        open={confirmApproveOpen}
        onOpenChange={setConfirmApproveOpen}
        title={`Approve ${application.name}${application.requestedRole ? ` as ${isManager ? "Manager" : "Technician"}` : ""}?`}
        description={
          isManager && existingManagerName
            ? `⚠️ Warning: ${targetDepartment} already has an assigned manager (${existingManagerName}). Approving will appoint ${application.name} as Manager. Proceed with appointment?`
            : `${application.name} will be assigned the ${application.requestedRole || "Technician"} role in ${targetDepartment}. They will be granted ${isManager ? "supervisory and triage" : "field dispatch"} permissions.`
        }
        confirmText={`Approve ${isManager ? "Manager" : "Candidate"}`}
        cancelText="Cancel"
        variant="default"
        isLoading={isMutating}
        onConfirm={async () => {
          await onApprove(application.id);
          setConfirmApproveOpen(false);
        }}
      />

      {/* Rejection Dialog with Required Reason */}
      <RejectApplicationDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        applicant={application}
        onConfirm={async (reason) => {
          await onReject(application.id, reason);
        }}
        isLoading={isMutating}
      />
    </>
  );
}
