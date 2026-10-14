"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Clock, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";

interface OverviewHeaderProps {
  escalatedCount?: number;
}

export function OverviewHeader({ escalatedCount = 0 }: OverviewHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const slaCheckMutation = useMutation({
    mutationFn: () => adminService.triggerCheckOverdueSlas(),
    onSuccess: (data) => {
      const count =
        data.complaintsProcessed ??
        data.overdueCount ??
        data.checkedCount ??
        0;
      toast.success(
        data.message ||
          (count > 0
            ? `SLA scan complete: ${count} overdue complaints flagged`
            : "SLA scan complete: No new overdue complaints found")
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to run SLA check.");
    },
  });

  return (
    <PageHeader
      title="City overview"
      description="Executive telemetry, real-time civic workload, department metrics, and escalated alerts."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Run SLA check */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => slaCheckMutation.mutate()}
            disabled={slaCheckMutation.isPending}
            className="text-xs font-semibold border-border hover:bg-muted/80 text-foreground transition-all duration-300"
          >
            {slaCheckMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin text-violet-500" />
                Scanning SLAs...
              </>
            ) : (
              <>
                <Clock className="size-3.5 mr-1.5 text-violet-500" />
                Run SLA check
              </>
            )}
          </Button>

          {/* View escalations */}
          <Button
            type="button"
            size="sm"
            onClick={() => router.push("/admin/complaints?tab=escalated")}
            className="text-xs font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldAlert className="size-3.5 mr-1.5" />
            View escalations
            {escalatedCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 px-1.5 py-0 h-4 min-w-4 text-[10px] font-extrabold bg-white/20 text-white rounded-full flex items-center justify-center animate-pulse"
              >
                {escalatedCount}
              </Badge>
            )}
          </Button>
        </div>
      }
    />
  );
}
