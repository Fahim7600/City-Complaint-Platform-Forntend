"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Moon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { technicianService } from "@/services/technician.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";

export function AvailabilityCard() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const userAvailable = user?.isAvailable ?? true;
  const [optimisticAvailable, setOptimisticAvailable] = React.useState<boolean | null>(null);

  const internalAvailable =
    optimisticAvailable !== null ? optimisticAvailable : userAvailable;

  const mutation = useMutation({
    mutationFn: (newAvailable: boolean) =>
      technicianService.updateAvailability(newAvailable),
    onMutate: async (newAvailable: boolean) => {
      // Optimistic update
      setOptimisticAvailable(newAvailable);
      if (user) {
        setUser({ ...user, isAvailable: newAvailable });
      }
      return { previousUser: user };
    },
    onError: (err, _val, context) => {
      // Rollback on error
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      setOptimisticAvailable(null);
      toast.error(
        getErrorMessage(err) || "Failed to update availability status."
      );
    },
    onSuccess: (_data, newAvailable) => {
      setOptimisticAvailable(null);
      if (newAvailable) {
        toast.success("You're now available");
      } else {
        toast.success("Marked as on leave — managers won't assign you new jobs");
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.technicians.all });
    },
  });

  const handleToggle = (checked: boolean) => {
    if (mutation.isPending) return;
    mutation.mutate(checked);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-500 border backdrop-blur-md",
        internalAvailable
          ? "border-teal-500/40 bg-gradient-to-r from-teal-500/10 via-background to-emerald-500/10 shadow-[0_0_25px_rgba(20,184,166,0.15)]"
          : "border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-background to-orange-500/10 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
      )}
    >
      {/* Top glow stripe */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 transition-all duration-500",
          internalAvailable
            ? "bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"
        )}
      />

      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 shadow-md",
              internalAvailable
                ? "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30 shadow-teal-500/20"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-amber-500/20"
            )}
          >
            {internalAvailable ? (
              <CheckCircle2 className="size-6 animate-pulse" />
            ) : (
              <Moon className="size-6" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                {internalAvailable ? "Available for New Jobs" : "On Leave / Off-Duty"}
              </h3>
              {mutation.isPending && (
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              {internalAvailable
                ? "Your status is active. Department managers can assign incoming repair tickets to your queue."
                : "Managers will not dispatch new tickets to you while on leave. Active jobs remain in your queue."}
            </p>
          </div>
        </div>

        {/* Switch Control */}
        <div className="flex items-center gap-3 self-end sm:self-center bg-card/60 px-4 py-2.5 rounded-2xl border border-border/60 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">
            {internalAvailable ? "Active" : "On leave"}
          </span>
          <Switch
            checked={internalAvailable}
            onCheckedChange={handleToggle}
            disabled={mutation.isPending}
            className={cn(
              "transition-colors scale-110",
              internalAvailable
                ? "data-checked:bg-teal-600"
                : "data-unchecked:bg-amber-600"
            )}
            aria-label="Toggle field work availability"
          />
        </div>
      </CardContent>
    </Card>
  );
}
