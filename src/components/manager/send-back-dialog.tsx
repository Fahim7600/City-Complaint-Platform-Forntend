"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw } from "lucide-react";
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
import type { PaginatedData } from "@/types/api";

const sendBackSchema = z.object({
  note: z
    .string()
    .trim()
    .min(3, "Please provide instructions on what additional work is required")
    .max(500, "Note cannot exceed 500 characters"),
});

type SendBackFormData = z.infer<typeof sendBackSchema>;

interface SendBackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
}

export function SendBackDialog({
  open,
  onOpenChange,
  complaint,
}: SendBackDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SendBackFormData>({
    resolver: zodResolver(sendBackSchema),
    defaultValues: { note: "" },
  });

  const noteVal = watch("note", "");

  const sendBackMutation = useMutation({
    mutationFn: (data: SendBackFormData) =>
      complaintService.updateStatus(complaint.id, {
        status: ComplaintStatus.IN_PROGRESS,
        note: data.note.trim(),
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.all,
      });

      const previousDetail = queryClient.getQueryData<Complaint>(
        queryKeys.complaints.detail(complaint.id)
      );

      if (previousDetail) {
        queryClient.setQueryData<Complaint>(
          queryKeys.complaints.detail(complaint.id),
          {
            ...previousDetail,
            status: ComplaintStatus.IN_PROGRESS,
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
              item.id === complaint.id
                ? { ...item, status: ComplaintStatus.IN_PROGRESS }
                : item
            ),
          };
        }
      );

      return { previousDetail };
    },
    onError: (err, _val, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.complaints.detail(complaint.id),
          context.previousDetail
        );
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.error(getErrorMessage(err) || "Failed to send back complaint.");
    },
    onSuccess: () => {
      toast.success("Sent back for more work");
      onOpenChange(false);
      reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
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

  const onSubmit = (data: SendBackFormData) => {
    sendBackMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <RotateCcw className="size-5 text-amber-500" />
            Send Back to Technician
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Reopen this ticket from Resolved back to In Progress. Provide clear instructions for the technician on what issues remain unresolved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="send-back-note" className="font-semibold text-foreground">
                Required Note for Technician <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {noteVal.length}/500
              </span>
            </div>
            <Textarea
              id="send-back-note"
              {...register("note")}
              placeholder="Explain why the resolution was incomplete or what further work is required..."
              rows={4}
              className="text-xs resize-none"
              disabled={sendBackMutation.isPending}
            />
            {errors.note && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.note.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={sendBackMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={sendBackMutation.isPending}
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white"
            >
              {sendBackMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Sending back...
                </>
              ) : (
                "Send back for more work"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
