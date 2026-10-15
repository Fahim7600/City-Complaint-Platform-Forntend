"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import type { Complaint } from "@/types/complaint";

interface DeleteComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
  onDeleted?: () => void;
}

export function DeleteComplaintDialog({
  open,
  onOpenChange,
  complaint,
  onDeleted,
}: DeleteComplaintDialogProps) {
  const queryClient = useQueryClient();
  const [typedConfirm, setTypedConfirm] = React.useState("");

  const shortId = complaint.id.slice(0, 8);
  const isMatch = typedConfirm.trim().toLowerCase() === shortId.toLowerCase();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTypedConfirm("");
    }
    onOpenChange(nextOpen);
  };

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteComplaint(complaint.id),
    onSuccess: () => {
      toast.success("Complaint permanently deleted");
      setTypedConfirm("");
      onOpenChange(false);
      onDeleted?.();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to delete complaint.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
            <Trash2 className="size-5 text-destructive" />
            Delete Complaint Ticket
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            You are about to permanently delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{complaint.title}&quot;
            </span>{" "}
            (#{shortId}). This action cannot be reversed.
          </DialogDescription>
        </DialogHeader>

        <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 flex items-start gap-2.5 text-xs text-destructive">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Deleting this ticket removes it from citizen and department triage queues. All associated audit trails will be archived.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Label
            htmlFor="confirm-delete-input"
            className="text-xs font-semibold text-foreground"
          >
            Type <span className="font-mono font-bold text-destructive">{shortId}</span> to confirm deletion:
          </Label>
          <Input
            id="confirm-delete-input"
            value={typedConfirm}
            onChange={(e) => setTypedConfirm(e.target.value)}
            placeholder={`Type ${shortId} to confirm`}
            className="text-xs font-mono h-9"
            disabled={deleteMutation.isPending}
            autoComplete="off"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!isMatch || deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
            className="text-xs font-semibold shadow-sm"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-3.5 mr-1.5" />
                Permanently Delete Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
