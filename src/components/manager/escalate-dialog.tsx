"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowUpRight, Loader2 } from "lucide-react";
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
import type { Complaint } from "@/types/complaint";

const escalateFormSchema = z.object({
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason cannot exceed 500 characters"),
});

type EscalateFormData = z.infer<typeof escalateFormSchema>;

interface EscalateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
}

export function EscalateDialog({
  open,
  onOpenChange,
  complaint,
}: EscalateDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EscalateFormData>({
    resolver: zodResolver(escalateFormSchema),
    defaultValues: { reason: "" },
  });

  const reasonVal = watch("reason", "");

  const escalateMutation = useMutation({
    mutationFn: (data: EscalateFormData) =>
      complaintService.escalate(complaint.id, { reason: data.reason.trim() }),
    onSuccess: () => {
      toast.success("Escalated to the Admin");
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
      toast.error(getErrorMessage(err) || "Failed to escalate complaint.");
    },
  });

  const onSubmit = (data: EscalateFormData) => {
    escalateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <AlertCircle className="size-5 text-rose-500" />
            Escalate to Central Administrator
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Transfer oversight of{" "}
            <span className="font-semibold text-foreground">
              &quot;{complaint.title}&quot;
            </span>{" "}
            to city executive administrators. Provide the justification for escalated municipal intervention.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="escalation-reason" className="text-xs font-semibold">
                Escalation Justification <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {reasonVal.length}/500
              </span>
            </div>
            <Textarea
              id="escalation-reason"
              {...register("reason")}
              rows={4}
              placeholder="Explain why standard department procedures cannot resolve this complaint (e.g. inter-department dependency, budget authorization, severe hazard)..."
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
              disabled={escalateMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={escalateMutation.isPending}
              className="text-xs font-semibold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md shadow-rose-500/20"
            >
              {escalateMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Escalating...
                </>
              ) : (
                <>
                  <ArrowUpRight className="size-3.5 mr-1.5" />
                  Confirm Escalation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
