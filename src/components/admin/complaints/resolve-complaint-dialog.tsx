"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
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

const resolveComplaintSchema = z.object({
  note: z
    .string()
    .trim()
    .min(3, "Resolution note must be at least 3 characters")
    .max(500, "Note cannot exceed 500 characters"),
});

type ResolveComplaintFormData = z.infer<typeof resolveComplaintSchema>;

interface ResolveComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
}

export function ResolveComplaintDialog({
  open,
  onOpenChange,
  complaint,
}: ResolveComplaintDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ResolveComplaintFormData>({
    resolver: zodResolver(resolveComplaintSchema),
    defaultValues: { note: "" },
  });

  const noteVal = watch("note", "");

  const resolveMutation = useMutation({
    mutationFn: (data: ResolveComplaintFormData) =>
      complaintService.updateStatus(complaint.id, {
        status: ComplaintStatus.RESOLVED,
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
            status: ComplaintStatus.RESOLVED,
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
                ? { ...item, status: ComplaintStatus.RESOLVED }
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
      toast.error(getErrorMessage(err) || "Failed to resolve complaint.");
    },
    onSuccess: () => {
      toast.success("Complaint resolved directly");
      onOpenChange(false);
      reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const onSubmit = (data: ResolveComplaintFormData) => {
    resolveMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <CheckCircle2 className="size-5 text-emerald-500" />
            Directly Resolve Complaint
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide resolution notes explaining the corrective actions taken for{" "}
            <span className="font-semibold text-foreground">
              &quot;{complaint.title}&quot;
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label
                htmlFor="resolve-complaint-note"
                className="font-semibold text-foreground"
              >
                Required Resolution Note <span className="text-destructive">*</span>
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {noteVal.length}/500
              </span>
            </div>
            <Textarea
              id="resolve-complaint-note"
              {...register("note")}
              placeholder="Describe how this complaint was remediated..."
              rows={4}
              className="text-xs resize-none"
              disabled={resolveMutation.isPending}
            />
            {errors.note && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.note.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={resolveMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={resolveMutation.isPending}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
            >
              {resolveMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Resolving...
                </>
              ) : (
                "Resolve Ticket"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
