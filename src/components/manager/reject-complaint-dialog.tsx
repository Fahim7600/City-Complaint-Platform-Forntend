"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
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
import { getErrorMessage } from "@/lib/axios";
import { ComplaintStatus, type Complaint } from "@/types/complaint";

const rejectSchema = z.object({
  reason: z
    .string()
    .min(5, "Rejection explanation must be at least 5 characters")
    .max(500, "Rejection explanation cannot exceed 500 characters"),
});

type RejectFormData = z.infer<typeof rejectSchema>;

interface RejectComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
}

export function RejectComplaintDialog({
  open,
  onOpenChange,
  complaint,
}: RejectComplaintDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "" },
  });

  const reasonVal = watch("reason", "");

  const rejectMutation = useMutation({
    mutationFn: (data: RejectFormData) =>
      complaintService.updateStatus(complaint.id, {
        status: ComplaintStatus.REJECTED,
        note: data.reason.trim(),
      }),
    onSuccess: () => {
      toast.success("Complaint rejected");
      onOpenChange(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to reject complaint.");
    },
  });

  const onSubmit = (data: RejectFormData) => {
    rejectMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
            <XCircle className="size-5 text-destructive" />
            Reject Complaint Ticket
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Rejecting this filing will remove it from operational queues. The citizen will be notified with your explanation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
          <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-start gap-2.5">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Permanent Triage Action</span>
              <p className="text-[11px] leading-relaxed">
                Only reject tickets that fall outside municipal jurisdiction, violate policies, or cannot be processed.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="reject-reason" className="text-xs font-semibold">
                Reason for Rejection <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {reasonVal.length}/500
              </span>
            </div>
            <Textarea
              id="reject-reason"
              {...register("reason")}
              rows={3}
              placeholder="Provide a clear, respectful reason for rejection to the citizen..."
              className="text-xs bg-background/80 resize-none"
            />
            {errors.reason && (
              <p className="text-xs font-medium text-destructive">
                {errors.reason.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={rejectMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={rejectMutation.isPending}
              className="text-xs font-semibold shadow-sm"
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="size-3.5 mr-1.5" />
                  Reject Ticket
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
