"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, XCircle } from "lucide-react";
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
import type { User } from "@/types/user";

const rejectApplicationSchema = z.object({
  reason: z
    .string()
    .min(3, "Please provide at least 3 characters explaining the rejection")
    .max(500, "Reason cannot exceed 500 characters"),
});

type RejectApplicationFormData = z.infer<typeof rejectApplicationSchema>;

interface RejectApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: User;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

export function RejectApplicationDialog({
  open,
  onOpenChange,
  applicant,
  onConfirm,
  isLoading = false,
}: RejectApplicationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RejectApplicationFormData>({
    resolver: zodResolver(rejectApplicationSchema),
    defaultValues: { reason: "" },
  });

  const reasonVal = watch("reason", "");

  const onSubmit = async (data: RejectApplicationFormData) => {
    await onConfirm(data.reason.trim());
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
            <XCircle className="size-5 text-destructive" />
            Reject Staff Application
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Decline the candidate application from{" "}
            <span className="font-semibold text-foreground">
              {applicant.name}
            </span>{" "}
            for {applicant.requestedRole?.toLowerCase() || "staff"} position.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="reject-app-reason" className="text-xs font-semibold">
                Reason for Rejection <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground">
                {reasonVal.length}/500
              </span>
            </div>
            <Textarea
              id="reject-app-reason"
              {...register("reason")}
              rows={3}
              placeholder="e.g. Qualification mismatch, department capacity reached, insufficient field experience..."
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
              disabled={isLoading}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isLoading}
              className="text-xs font-semibold shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="size-3.5 mr-1.5" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
