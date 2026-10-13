"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  trigger?: React.ReactElement;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  trigger,
  variant = "destructive",
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);

  const effectiveLoading = isLoading || internalLoading;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange?.(false);
    } catch {
      // Error handled by caller
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent className="max-w-md border border-border/80 bg-background/95 backdrop-blur-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-lg font-semibold text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
          <AlertDialogCancel disabled={effectiveLoading}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={effectiveLoading}
            className="font-medium shadow-sm transition-all duration-200"
          >
            {effectiveLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
