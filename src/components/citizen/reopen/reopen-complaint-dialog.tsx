"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { History, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { formatDate } from "@/lib/format-date";
import { getErrorMessage } from "@/lib/axios";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import { cn } from "@/lib/utils";

const reopenReasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Reopen reason must be at least 5 characters long")
    .max(500, "Reopen reason cannot exceed 500 characters"),
});

const REOPEN_WINDOW_DAYS = 7;

interface ReopenComplaintDialogProps {
  complaint: Complaint;
  onSuccess?: () => void;
}

export function ReopenComplaintDialog({
  complaint,
  onSuccess,
}: ReopenComplaintDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [now] = React.useState(() => Date.now());

  // Can ONLY be reopened when RESOLVED
  if (complaint.status !== ComplaintStatus.RESOLVED) {
    return null;
  }

  // Calculate reopen window expiration
  const resolvedTime = complaint.resolvedAt
    ? new Date(complaint.resolvedAt).getTime()
    : 0;
  const windowMs = REOPEN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const expirationDate = new Date(resolvedTime + windowMs);
  const isExpired = now > resolvedTime + windowMs;

  if (isExpired || !complaint.resolvedAt) {
    return (
      <div className="p-3 rounded-xl border border-border/70 bg-muted/40 text-xs text-muted-foreground flex items-center gap-2">
        <History className="size-4 shrink-0 text-muted-foreground" />
        <span>
          Reopen window closed on{" "}
          <strong className="text-foreground">{formatDate(expirationDate)}</strong>.
        </span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = reopenReasonSchema.safeParse({ reason });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid reason");
      return;
    }

    setIsLoading(true);
    try {
      await complaintService.reopen(complaint.id, { reason: reason.trim() });
      toast.success("Complaint reopened");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.complaints.detail(complaint.id),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.public.all }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications.all,
        }),
      ]);

      setOpen(false);
      setReason("");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to reopen complaint.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 font-medium"
      >
        <RotateCcw className="size-4 mr-2" />
        Reopen Complaint
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border border-border/80 bg-background/95 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg font-semibold text-foreground">
                Reopen Complaint
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                If the resolved work was incomplete or the civic defect has recurred, state the reason below.
                You can reopen tickets within {REOPEN_WINDOW_DAYS} days of resolution.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="reopen-reason" className="text-xs font-semibold">
                  Reason for Reopening <span className="text-destructive">*</span>
                </Label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    reason.length < 5 && reason.length > 0
                      ? "text-rose-500 font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {reason.length}/500 (min 5)
                </span>
              </div>
              <Textarea
                id="reopen-reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError(null);
                }}
                maxLength={500}
                rows={4}
                placeholder="Explain what is still broken or why the repair does not satisfy requirements..."
                className={cn(
                  "resize-y bg-background/80 border-border/70 focus-visible:ring-violet-500/30 text-xs",
                  error && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => setOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || reason.trim().length < 5}
                className="text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                    Reopening...
                  </>
                ) : (
                  "Confirm Reopen"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
