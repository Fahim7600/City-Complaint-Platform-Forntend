"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { ComplaintStatus, type Complaint } from "@/types/complaint";

interface CancelComplaintActionProps {
  complaint: Complaint;
  onSuccess?: () => void;
}

export function CancelComplaintAction({
  complaint,
  onSuccess,
}: CancelComplaintActionProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Can ONLY be cancelled while PENDING
  if (complaint.status !== ComplaintStatus.PENDING) {
    return null;
  }

  const handleCancel = async () => {
    setIsLoading(true);

    const detailKey = queryKeys.complaints.detail(complaint.id);
    const previousComplaint = queryClient.getQueryData<Complaint>(detailKey);

    // Optimistic status update
    if (previousComplaint) {
      queryClient.setQueryData<Complaint>(detailKey, {
        ...previousComplaint,
        status: ComplaintStatus.CANCELLED,
      });
    }

    try {
      await complaintService.cancel(complaint.id);
      toast.success("Complaint cancelled");

      // Invalidate relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: detailKey }),
        queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.public.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
      ]);

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      // Rollback optimistic update
      if (previousComplaint) {
        queryClient.setQueryData<Complaint>(detailKey, previousComplaint);
      }
      toast.error(getErrorMessage(err) || "Failed to cancel complaint.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="w-full font-medium shadow-sm transition-all duration-200"
      >
        <Ban className="size-4 mr-2" />
        Cancel Complaint
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel this complaint?"
        description="This action cannot be undone. Are you sure you want to cancel this complaint before a technician is assigned?"
        confirmText="Yes, Cancel Complaint"
        cancelText="Keep Open"
        variant="destructive"
        isLoading={isLoading}
        onConfirm={handleCancel}
      />
    </>
  );
}
