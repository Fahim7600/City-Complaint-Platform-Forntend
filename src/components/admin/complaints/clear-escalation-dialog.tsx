"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
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
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import type { Complaint } from "@/types/complaint";
import type { PaginatedData } from "@/types/api";

const clearEscalationSchema = z.object({
  note: z.string().trim().max(500, "Note cannot exceed 500 characters").optional(),
});

type ClearEscalationFormData = z.infer<typeof clearEscalationSchema>;

interface ClearEscalationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
}

export function ClearEscalationDialog({
  open,
  onOpenChange,
  complaint,
}: ClearEscalationDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClearEscalationFormData>({
    resolver: zodResolver(clearEscalationSchema),
    defaultValues: { note: "" },
  });

  const noteVal = watch("note", "");

  const clearMutation = useMutation({
    mutationFn: (data: ClearEscalationFormData) =>
      adminService.clearEscalation(complaint.id, data.note?.trim() || undefined),
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
            isEscalated: false,
            escalationReason: null,
            escalatedAt: null,
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
                ? {
                    ...item,
                    isEscalated: false,
                    escalationReason: null,
                    escalatedAt: null,
                  }
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
      toast.error(getErrorMessage(err) || "Failed to clear escalation.");
    },
    onSuccess: () => {
      toast.success("Escalation cleared");
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

  const onSubmit = (data: ClearEscalationFormData) => {
    clearMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <ShieldAlert className="size-5 text-rose-500" />
            Clear Escalation Status
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Remove the administrator escalation flag from{" "}
            <span className="font-semibold text-foreground">
              &quot;{complaint.title}&quot;
            </span>
            . You can optionally attach an administrative resolution note.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Label
                htmlFor="clear-escalation-note"
                className="font-semibold text-foreground"
              >
                Administrative Note (Optional)
              </Label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {noteVal?.length || 0}/500
              </span>
            </div>
            <Textarea
              id="clear-escalation-note"
              {...register("note")}
              placeholder="Detail actions taken or rationale for de-escalating this ticket..."
              rows={4}
              className="text-xs resize-none"
              disabled={clearMutation.isPending}
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
              disabled={clearMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={clearMutation.isPending}
              className="text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20"
            >
              {clearMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Clearing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 mr-1.5" />
                  Clear Escalation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
