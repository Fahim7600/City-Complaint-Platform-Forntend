"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Flame,
  Loader2,
  MapPin,
  RotateCcw,
  UserCheck,
  UserX,
  Wrench,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueueSlaChip } from "./queue-sla-chip";
import {
  ProgressStepper,
  AttachmentsGallery,
  StatusHistoryTimeline,
} from "@/components/shared/complaint";
import { AssignTechnicianDialog } from "./assign-technician-dialog";
import { EscalateDialog } from "./escalate-dialog";
import { TriagePriorityDialog } from "./triage-priority-dialog";
import { RejectComplaintDialog } from "./reject-complaint-dialog";
import { SendBackDialog } from "./send-back-dialog";
import { ClearEscalationDialog } from "@/components/admin/complaints/clear-escalation-dialog";
import { DeleteComplaintDialog } from "@/components/admin/complaints/delete-complaint-dialog";
import { ResolveComplaintDialog } from "@/components/admin/complaints/resolve-complaint-dialog";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { formatDate } from "@/lib/format-date";
import { getErrorMessage } from "@/lib/axios";
import { useAuth } from "@/hooks/use-auth";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import type { PaginatedData } from "@/types/api";

interface ComplaintSheetProps {
  complaintId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintSheet({
  complaintId,
  open,
  onOpenChange,
}: ComplaintSheetProps) {
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const isAdmin = role === "ADMIN";

  const [assignOpen, setAssignOpen] = React.useState(false);
  const [isReassign, setIsReassign] = React.useState(false);
  const [escalateOpen, setEscalateOpen] = React.useState(false);
  const [triageOpen, setTriageOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [sendBackOpen, setSendBackOpen] = React.useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
  const [clearEscalationOpen, setClearEscalationOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [resolveDirectOpen, setResolveDirectOpen] = React.useState(false);

  // Fetch full complaint detail
  const {
    data: complaint,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.complaints.detail(complaintId || ""),
    queryFn: () => complaintService.getById(complaintId!),
    enabled: open && Boolean(complaintId),
  });

  // Fetch attachments
  const { data: attachments = [] } = useQuery({
    queryKey: queryKeys.complaints.attachments(complaintId || ""),
    queryFn: () => complaintService.listAttachments(complaintId!),
    enabled: open && Boolean(complaintId),
  });

  // Close complaint mutation (RESOLVED -> CLOSED) with optimistic update
  const closeMutation = useMutation({
    mutationFn: () =>
      complaintService.updateStatus(complaintId!, {
        status: ComplaintStatus.CLOSED,
      }),
    onMutate: async () => {
      if (!complaintId) return;
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.detail(complaintId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.all,
      });

      const previousDetail = queryClient.getQueryData<Complaint>(
        queryKeys.complaints.detail(complaintId)
      );

      if (previousDetail) {
        queryClient.setQueryData<Complaint>(
          queryKeys.complaints.detail(complaintId),
          {
            ...previousDetail,
            status: ComplaintStatus.CLOSED,
          }
        );
      }

      queryClient.setQueriesData<PaginatedData<Complaint>>(
        { queryKey: queryKeys.complaints.all },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === complaintId
                ? { ...item, status: ComplaintStatus.CLOSED }
                : item
            ),
          };
        }
      );

      return { previousDetail };
    },
    onError: (err, _val, context) => {
      if (complaintId && context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.complaints.detail(complaintId),
          context.previousDetail
        );
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.error(getErrorMessage(err) || "Failed to close complaint.");
    },
    onSuccess: () => {
      toast.success("Complaint closed");
      setCloseConfirmOpen(false);
    },
    onSettled: () => {
      if (complaintId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.complaints.detail(complaintId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.public.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicians.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!complaint) return;
    navigator.clipboard.writeText(complaint.id);
    toast.success("Complaint ID copied");
  };

  const isTerminal =
    complaint?.status === ComplaintStatus.CLOSED ||
    complaint?.status === ComplaintStatus.CANCELLED ||
    complaint?.status === ComplaintStatus.REJECTED;

  const isPending = complaint?.status === ComplaintStatus.PENDING;
  const isAssignedOrActive =
    complaint?.status === ComplaintStatus.ASSIGNED ||
    complaint?.status === ComplaintStatus.IN_PROGRESS;
  const isResolved = complaint?.status === ComplaintStatus.RESOLVED;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl sm:w-[600px] h-full overflow-y-auto p-6 space-y-6"
      >
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground text-xs">
            <Loader2 className="size-6 animate-spin text-violet-500" />
            <p>Loading complaint details...</p>
          </div>
        ) : isError || !complaint ? (
          <div className="py-24 text-center text-xs text-muted-foreground space-y-3">
            <AlertCircle className="size-8 text-rose-500 mx-auto" />
            <p className="font-semibold text-foreground">Failed to load complaint</p>
            <p className="text-[11px]">The ticket may have been removed or belongs to another department.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Close Sheet
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-3 pb-4 border-b border-border/50 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    #{complaint.id.slice(0, 8)}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    aria-label="Copy complaint ID"
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="size-3" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={complaint.status} />
                  <StatusBadge priority={complaint.priority} />
                  {complaint.isEscalated && (
                    <StatusBadge isEscalated />
                  )}
                </div>
              </div>

              <div>
                <SheetTitle className="text-lg font-bold text-foreground">
                  {complaint.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                  <span>Filed by {complaint.citizen?.name || "Citizen"}</span>
                  <span>•</span>
                  <span>{formatDate(complaint.createdAt)}</span>
                  <span>•</span>
                  <span className="font-medium text-foreground">
                    {complaint.category?.name || "Civic Category"}
                  </span>
                </SheetDescription>
              </div>

              {/* SLA chip & resolution status */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  SLA Status:
                </span>
                <QueueSlaChip
                  slaDueAt={complaint.slaDueAt}
                  status={complaint.status}
                />
              </div>
            </SheetHeader>

            {/* Escalation Warning Banner */}
            {complaint.isEscalated && (
              <div className="p-4 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-background to-pink-500/10 space-y-1.5 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="size-4 text-rose-500 animate-pulse" />
                  <span>Escalated to Municipal Administrator</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {complaint.escalationReason ||
                    "This complaint has been escalated to city administrators for specialized intervention."}
                </p>
                {complaint.escalatedAt && (
                  <span className="text-[10px] text-muted-foreground block pt-1">
                    Escalated on {formatDate(complaint.escalatedAt)}
                  </span>
                )}
              </div>
            )}

            {/* Actions Bar for Managers */}
            <div className="p-4 rounded-2xl border border-violet-500/30 bg-violet-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Wrench className="size-3.5 text-violet-500" />
                  Manager Dispatch & Triage Actions
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Assign Technician (PENDING status) */}
                {isPending && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsReassign(false);
                      setAssignOpen(true);
                    }}
                    className="text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/25"
                  >
                    <UserCheck className="size-3.5 mr-1.5" />
                    Assign Technician
                  </Button>
                )}

                {/* 2. Reassign Technician (ADMIN only: Already ASSIGNED or IN_PROGRESS) */}
                {isAssignedOrActive && isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsReassign(true);
                      setAssignOpen(true);
                    }}
                    className="text-xs font-semibold border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                  >
                    <UserCheck className="size-3.5 mr-1.5" />
                    Reassign Technician
                  </Button>
                )}

                {/* 3. Actions on RESOLVED complaints (Managers & Admins) */}
                {isResolved && (
                  <>
                    {/* Close complaint (RESOLVED -> CLOSED): teal button */}
                    <Button
                      size="sm"
                      onClick={() => setCloseConfirmOpen(true)}
                      className="text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm shadow-teal-500/25"
                    >
                      <CheckCircle2 className="size-3.5 mr-1.5" />
                      Close complaint
                    </Button>

                    {/* Send back to technician (RESOLVED -> IN_PROGRESS): outline button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSendBackOpen(true)}
                      className="text-xs font-semibold border-border hover:bg-muted text-foreground"
                    >
                      <RotateCcw className="size-3.5 mr-1.5 text-amber-500" />
                      Send back to technician
                    </Button>
                  </>
                )}

                {/* 4. Re-triage Priority (Non-terminal) */}
                {!isTerminal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTriageOpen(true)}
                    className="text-xs font-semibold border-border/80 hover:bg-muted"
                  >
                    <Flame className="size-3.5 mr-1.5 text-amber-500" />
                    Re-triage Priority
                  </Button>
                )}

                {/* 5. Clear Escalation (ADMIN only, when escalated) */}
                {complaint.isEscalated && isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setClearEscalationOpen(true)}
                    className="text-xs font-semibold border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                  >
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    Clear Escalation
                  </Button>
                )}

                {/* 6. Directly Resolve (ADMIN only, on active tickets) */}
                {isAdmin && !isTerminal && !isResolved && (
                  <Button
                    size="sm"
                    onClick={() => setResolveDirectOpen(true)}
                    className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    Resolve Directly
                  </Button>
                )}

                {/* 7. Escalate to Admin (Managers only: Non-terminal & not already escalated) */}
                {!isAdmin && !isTerminal && !complaint.isEscalated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEscalateOpen(true)}
                    className="text-xs font-semibold border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                  >
                    <ArrowUpRight className="size-3.5 mr-1.5" />
                    Escalate to Admin
                  </Button>
                )}

                {/* 8. Reject Ticket (PENDING only) */}
                {isPending && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setRejectOpen(true)}
                    className="text-xs font-semibold shadow-sm ml-auto"
                  >
                    <XCircle className="size-3.5 mr-1.5" />
                    Reject Ticket
                  </Button>
                )}

                {/* 9. Permanent Delete (ADMIN only) */}
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="text-xs font-semibold shadow-sm ml-auto"
                  >
                    <XCircle className="size-3.5 mr-1.5" />
                    Delete Ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Lifecycle Progress Stepper */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Lifecycle Progression
              </h4>
              <ProgressStepper status={complaint.status} />
            </div>

            {/* Assigned Technician Card */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Field Technician
              </h4>
              {complaint.assignedTechnician ? (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm text-xs">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 rounded-xl border border-border/60">
                      {complaint.assignedTechnician.avatarUrl && (
                        <AvatarImage
                          src={complaint.assignedTechnician.avatarUrl}
                          alt={complaint.assignedTechnician.name}
                        />
                      )}
                      <AvatarFallback className="rounded-xl bg-violet-500/15 text-violet-600 font-bold text-xs">
                        {complaint.assignedTechnician.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground text-xs block">
                        {complaint.assignedTechnician.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        {complaint.assignedTechnician.email || "Active Technician"}
                      </span>
                    </div>
                  </div>

                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                    Dispatched
                  </Badge>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-dashed border-border/70 text-xs text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserX className="size-4 text-muted-foreground" />
                    <span>Unassigned — Awaiting technician dispatch</span>
                  </div>
                  {isPending && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsReassign(false);
                        setAssignOpen(true);
                      }}
                      className="text-xs h-7"
                    >
                      Assign now
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Description & Location */}
            <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-card/50 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-foreground">Incident Description</span>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-xs">
                  {complaint.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-muted-foreground">
                <MapPin className="size-4 text-violet-500 shrink-0" />
                <span className="font-medium text-foreground">{complaint.location}</span>
              </div>
            </div>

            {/* Evidence Photos (with Lightbox) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Citizen Evidence Photos
              </h4>
              <AttachmentsGallery attachments={attachments} />
            </div>

            {/* Status History Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                Status History & Audit Trail
              </h4>
              <StatusHistoryTimeline complaint={complaint} />
            </div>
          </div>
        )}

        {/* Action Dialogs */}
        {complaint && (
          <>
            <AssignTechnicianDialog
              open={assignOpen}
              onOpenChange={setAssignOpen}
              complaint={complaint}
              isReassign={isReassign}
            />

            <EscalateDialog
              open={escalateOpen}
              onOpenChange={setEscalateOpen}
              complaint={complaint}
            />

            <TriagePriorityDialog
              open={triageOpen}
              onOpenChange={setTriageOpen}
              complaint={complaint}
            />

            <RejectComplaintDialog
              open={rejectOpen}
              onOpenChange={setRejectOpen}
              complaint={complaint}
            />

            <SendBackDialog
              open={sendBackOpen}
              onOpenChange={setSendBackOpen}
              complaint={complaint}
            />

            <ConfirmDialog
              open={closeConfirmOpen}
              onOpenChange={setCloseConfirmOpen}
              title="Close Complaint Ticket"
              description="Are you sure you want to mark this complaint as permanently closed? This confirms work is complete and finalized. The citizen will be notified."
              confirmText="Close complaint"
              variant="default"
              onConfirm={async () => {
                await closeMutation.mutateAsync();
              }}
              isLoading={closeMutation.isPending}
            />

            <ClearEscalationDialog
              open={clearEscalationOpen}
              onOpenChange={setClearEscalationOpen}
              complaint={complaint}
            />

            <ResolveComplaintDialog
              open={resolveDirectOpen}
              onOpenChange={setResolveDirectOpen}
              complaint={complaint}
            />

            <DeleteComplaintDialog
              open={deleteConfirmOpen}
              onOpenChange={setDeleteConfirmOpen}
              complaint={complaint}
              onDeleted={() => onOpenChange(false)}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
