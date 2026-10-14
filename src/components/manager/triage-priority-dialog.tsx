"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flame, Loader2, Save } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { Priority, type Complaint } from "@/types/complaint";
import type { PaginatedData } from "@/types/api";

const triageSchema = z.object({
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
});

type TriageFormData = z.infer<typeof triageSchema>;

interface TriagePriorityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
}

export function TriagePriorityDialog({
  open,
  onOpenChange,
  complaint,
}: TriagePriorityDialogProps) {
  const queryClient = useQueryClient();

  const { setValue, watch, handleSubmit } = useForm<TriageFormData>({
    resolver: zodResolver(triageSchema),
    defaultValues: {
      priority: complaint.priority,
    },
  });

  const selectedPriority = watch("priority");

  const triageMutation = useMutation({
    mutationFn: (data: TriageFormData) =>
      complaintService.update(complaint.id, { priority: data.priority }),
    onMutate: async (data: TriageFormData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });

      const prevDetail = queryClient.getQueryData<Complaint>(
        queryKeys.complaints.detail(complaint.id)
      );

      if (prevDetail) {
        queryClient.setQueryData<Complaint>(
          queryKeys.complaints.detail(complaint.id),
          { ...prevDetail, priority: data.priority }
        );
      }

      queryClient.setQueriesData<PaginatedData<Complaint>>(
        { queryKey: queryKeys.complaints.all },
        (old) => {
          if (!old?.items) return old;
          return {
            ...old,
            items: old.items.map((c) =>
              c.id === complaint.id ? { ...c, priority: data.priority } : c
            ),
          };
        }
      );

      return { prevDetail };
    },
    onError: (err, _vars, context) => {
      if (context?.prevDetail) {
        queryClient.setQueryData(
          queryKeys.complaints.detail(complaint.id),
          context.prevDetail
        );
      }
      toast.error(getErrorMessage(err) || "Failed to update priority.");
    },
    onSuccess: (updated) => {
      toast.success(`Priority updated to ${updated.priority}`);
      onOpenChange(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.all,
      });
    },
  });

  const onSubmit = (data: TriageFormData) => {
    triageMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Flame className="size-5 text-amber-500" />
            Re-triage Complaint Priority
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Adjust the response priority for &quot;{complaint.title}&quot;. This recalculates staff queue ordering.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <Label htmlFor="triage-priority" className="text-xs font-semibold">
              Select Priority Level
            </Label>
            <Select
              value={selectedPriority}
              onValueChange={(val) => setValue("priority", val as Priority)}
            >
              <SelectTrigger id="triage-priority" className="h-9 text-xs">
                <SelectValue placeholder="Choose priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Priority.LOW} className="text-xs">
                  Low — Minor inconvenience or cosmetic issue
                </SelectItem>
                <SelectItem value={Priority.MEDIUM} className="text-xs">
                  Medium — Standard civic resolution priority
                </SelectItem>
                <SelectItem value={Priority.HIGH} className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  High — Immediate attention or active public hazard
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={triageMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={triageMutation.isPending}
              className="text-xs font-semibold bg-primary text-primary-foreground shadow-sm"
            >
              {triageMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  Save Priority
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
