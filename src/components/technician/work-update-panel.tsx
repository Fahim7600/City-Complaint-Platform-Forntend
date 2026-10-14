"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  MessageSquare,
  Play,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { AttachmentType, ComplaintStatus, type Attachment, type Complaint } from "@/types/complaint";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

interface WorkUpdatePanelProps {
  complaint: Complaint;
  attachments?: Attachment[];
}

const resolveSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, "Please enter at least 5 characters detailing the repair work completed")
    .max(500, "Notes cannot exceed 500 characters"),
});

type ResolveFormData = z.infer<typeof resolveSchema>;

export function WorkUpdatePanel({
  complaint,
  attachments = [],
}: WorkUpdatePanelProps) {
  const queryClient = useQueryClient();
  const [resolveConfirmOpen, setResolveConfirmOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResolveFormData>({
    resolver: zodResolver(resolveSchema),
    defaultValues: { note: "" },
  });

  const noteVal = watch("note", "");

  const isAssigned = complaint.status === ComplaintStatus.ASSIGNED;
  const isInProgress = complaint.status === ComplaintStatus.IN_PROGRESS;
  const isResolvedOrClosed =
    complaint.status === ComplaintStatus.RESOLVED ||
    complaint.status === ComplaintStatus.CLOSED;

  // After-work proof attachments
  const afterWorkPhotos = attachments.filter(
    (a) => a.type === AttachmentType.AFTER_WORK
  );
  const hasAfterWorkPhotos = afterWorkPhotos.length > 0;

  // Fetch citizen review if resolved/closed
  const { data: review, isLoading: isReviewLoading } = useQuery({
    queryKey: queryKeys.complaints.review(complaint.id),
    queryFn: () => complaintService.getReview(complaint.id),
    enabled: isResolvedOrClosed,
    retry: false,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.complaints.detail(complaint.id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.technicians.all,
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.complaints.all,
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.public.all,
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.notifications.all,
    });
  };

  // 1. "Start work" mutation (ASSIGNED -> IN_PROGRESS)
  const startWorkMutation = useMutation({
    mutationFn: () =>
      complaintService.updateStatus(complaint.id, {
        status: ComplaintStatus.IN_PROGRESS,
        note: noteVal.trim() || undefined,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      const previous = queryClient.getQueryData<Complaint>(
        queryKeys.complaints.detail(complaint.id)
      );
      if (previous) {
        queryClient.setQueryData<Complaint>(
          queryKeys.complaints.detail(complaint.id),
          { ...previous, status: ComplaintStatus.IN_PROGRESS }
        );
      }
      return { previous };
    },
    onError: (err, _val, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.complaints.detail(complaint.id),
          context.previous
        );
      }
      toast.error(getErrorMessage(err) || "Failed to start work.");
    },
    onSuccess: () => {
      toast.success("Job started — repair work is now active");
    },
    onSettled: invalidateAll,
  });

  // 2. "Mark as resolved" mutation (IN_PROGRESS -> RESOLVED)
  const resolveMutation = useMutation({
    mutationFn: (data: ResolveFormData) =>
      complaintService.updateStatus(complaint.id, {
        status: ComplaintStatus.RESOLVED,
        note: data.note.trim(),
      }),
    onMutate: async (data: ResolveFormData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      const previous = queryClient.getQueryData<Complaint>(
        queryKeys.complaints.detail(complaint.id)
      );
      if (previous) {
        queryClient.setQueryData<Complaint>(
          queryKeys.complaints.detail(complaint.id),
          {
            ...previous,
            status: ComplaintStatus.RESOLVED,
            resolvedAt: new Date().toISOString(),
          }
        );
      }
      return { previous };
    },
    onError: (err, _val, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.complaints.detail(complaint.id),
          context.previous
        );
      }
      toast.error(getErrorMessage(err) || "Failed to resolve job.");
    },
    onSuccess: () => {
      toast.success("Job resolved — the citizen has been notified");
      setResolveConfirmOpen(false);
    },
    onSettled: invalidateAll,
  });

  const onConfirmResolve = async () => {
    await resolveMutation.mutateAsync({ note: noteVal.trim() });
  };

  return (
    <>
      <Card className="border border-border/80 bg-card/80 backdrop-blur-md shadow-lg sticky top-6 space-y-4">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Wrench className="size-4 text-violet-500" />
              Work Status Panel
            </CardTitle>
            <StatusBadge status={complaint.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* ASSIGNED STATE: Show "Start work" button */}
          {isAssigned && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-500/5 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5 text-sky-500" />
                  Work Order Dispatched
                </p>
                <p>
                  You are assigned to this ticket. Begin field assessment and repairs by initiating work.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => startWorkMutation.mutate()}
                disabled={startWorkMutation.isPending}
                className="w-full h-11 text-sm font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                {startWorkMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Starting work...
                  </>
                ) : (
                  <>
                    <Play className="size-4 mr-2 fill-current" />
                    Start work
                  </>
                )}
              </Button>
            </div>
          )}

          {/* IN_PROGRESS STATE: Notes textarea + "Mark as resolved" flow */}
          {isInProgress && (
            <form
              onSubmit={handleSubmit(() => {
                if (!hasAfterWorkPhotos) {
                  toast.error("Upload at least one after-work photo before marking as resolved.");
                  return;
                }
                setResolveConfirmOpen(true);
              })}
              className="space-y-4"
            >
              {/* Notes field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="tech-notes" className="font-bold text-foreground">
                    Resolution Notes <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {noteVal.length}/500
                  </span>
                </div>
                <Textarea
                  id="tech-notes"
                  {...register("note")}
                  placeholder="Detail the technical actions taken to fix this defect (e.g., replaced 10m pipe section, sealed junction, verified pressure)..."
                  rows={4}
                  className="text-xs resize-none bg-background/60"
                  disabled={resolveMutation.isPending}
                />
                {errors.note && (
                  <p className="text-[11px] font-semibold text-destructive">
                    {errors.note.message}
                  </p>
                )}
              </div>

              {/* Requirement Hints */}
              <div className="space-y-2 text-xs">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-lg border text-xs",
                    hasAfterWorkPhotos
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      "size-4 shrink-0",
                      hasAfterWorkPhotos ? "text-emerald-500" : "text-amber-500"
                    )}
                  />
                  <span>
                    {hasAfterWorkPhotos
                      ? `${afterWorkPhotos.length} after-work proof photo(s) attached`
                      : "Upload at least one after-work photo first"}
                  </span>
                </div>
              </div>

              {/* Action Button: Green Neon */}
              <Button
                type="submit"
                disabled={resolveMutation.isPending || !hasAfterWorkPhotos || noteVal.trim().length < 5}
                className={cn(
                  "w-full h-11 text-sm font-bold text-white shadow-lg transition-all duration-300",
                  hasAfterWorkPhotos && noteVal.trim().length >= 5
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/30 hover:scale-[1.02]"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none"
                )}
              >
                {resolveMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Submitting resolution...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 mr-2" />
                    Mark as resolved
                  </>
                )}
              </Button>
            </form>
          )}

          {/* RESOLVED OR CLOSED: Read-only summary + Citizen Review */}
          {isResolvedOrClosed && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                  <span>Work Order Completed</span>
                </div>
                {complaint.resolvedAt && (
                  <p className="text-[11px] text-muted-foreground">
                    Resolved on {formatDate(complaint.resolvedAt)}
                  </p>
                )}
              </div>

              {/* Citizen Review Display */}
              <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-amber-500" />
                    Citizen Performance Review
                  </span>
                  {review && (
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      {review.rating} ★
                    </span>
                  )}
                </div>

                {isReviewLoading ? (
                  <div className="py-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Checking for review...</span>
                  </div>
                ) : review ? (
                  <div className="space-y-2">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "size-4",
                            star <= review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/40"
                          )}
                        />
                      ))}
                    </div>
                    {review.comment ? (
                      <p className="text-xs text-muted-foreground italic leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/40">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Citizen gave a {review.rating}-star rating with no written remarks.
                      </p>
                    )}
                    <span className="text-[10px] text-muted-foreground block">
                      Reviewed on {formatDate(review.createdAt)}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                    The citizen has not submitted a feedback rating yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog on Mark As Resolved */}
      <ConfirmDialog
        open={resolveConfirmOpen}
        onOpenChange={setResolveConfirmOpen}
        title="Confirm Work Resolution"
        description={
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              Are you sure you want to mark this complaint as resolved? The citizen and department
              manager will be notified immediately.
            </p>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
              <div>
                <strong>Proof photos:</strong> {afterWorkPhotos.length} after-work attachment(s)
              </div>
              <div className="line-clamp-2">
                <strong>Resolution notes:</strong> {noteVal}
              </div>
            </div>
          </div>
        }
        confirmText="Confirm & Mark Resolved"
        cancelText="Review Again"
        variant="default"
        isLoading={resolveMutation.isPending}
        onConfirm={onConfirmResolve}
      />
    </>
  );
}
