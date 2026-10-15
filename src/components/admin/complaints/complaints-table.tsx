"use client";

import * as React from "react";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  Crown,
  Wrench,
} from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueueSlaChip } from "@/components/manager/queue-sla-chip";
import { CategoryIcon } from "@/components/technician/category-icon";
import { formatDate } from "@/lib/format-date";
import type { Complaint } from "@/types/complaint";

interface ComplaintsTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  onSelectComplaint: (complaint: Complaint) => void;
  showEscalationBanner?: boolean;
  emptyState?: React.ReactNode;
}

export function ComplaintsTable({
  complaints,
  isLoading,
  onSelectComplaint,
  showEscalationBanner = false,
  emptyState,
}: ComplaintsTableProps) {
  const columns: ColumnDef<Complaint>[] = React.useMemo(
    () => [
      {
        key: "complaint",
        header: "Complaint Details",
        cell: (item) => (
          <div className="space-y-1.5 min-w-0 max-w-sm">
            <div className="flex items-center gap-2">
              <CategoryIcon name={item.category?.name} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">
                    #{item.id.slice(0, 8)}
                  </span>
                  <span className="font-bold text-xs text-foreground truncate block">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Escalated banner if active tab is escalated */}
            {showEscalationBanner && item.isEscalated && (
              <div className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-[11px] text-rose-600 dark:text-rose-400 space-y-0.5">
                <div className="flex items-center gap-1 font-bold">
                  <AlertTriangle className="size-3 text-rose-500 shrink-0" />
                  <span>Escalation: {item.escalationReason || "Administrative review requested"}</span>
                </div>
                {item.escalatedAt && (
                  <span className="text-[10px] text-muted-foreground block">
                    Escalated {formatDate(item.escalatedAt)}
                  </span>
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "department",
        header: "Department",
        cell: (item) => (
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Building2 className="size-3 text-violet-500 shrink-0" />
              {item.department?.name || "General"}
            </span>
            <span className="text-[11px] text-muted-foreground block truncate">
              {item.category?.name || "Civic Service"}
            </span>
          </div>
        ),
      },
      {
        key: "citizen",
        header: "Citizen",
        cell: (item) => (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-foreground">
                {item.citizen?.name || "Citizen"}
              </span>
              {item.citizen?.isPremium && (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] px-1 py-0 font-semibold">
                  <Crown className="size-2 mr-0.5" />
                  Pro
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              {item.citizen?.email || ""}
            </span>
          </div>
        ),
      },
      {
        key: "priority",
        header: "Priority",
        cell: (item) => <StatusBadge priority={item.priority} />,
      },
      {
        key: "status",
        header: "Status",
        cell: (item) => (
          <div className="flex flex-col gap-1 items-start">
            <StatusBadge status={item.status} />
            {item.isEscalated && <StatusBadge isEscalated />}
          </div>
        ),
      },
      {
        key: "sla",
        header: "SLA Due",
        cell: (item) => (
          <QueueSlaChip slaDueAt={item.slaDueAt} status={item.status} />
        ),
      },
      {
        key: "technician",
        header: "Technician",
        cell: (item) =>
          item.assignedTechnician ? (
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Wrench className="size-3 text-teal-500 shrink-0" />
              {item.assignedTechnician.name}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Unassigned
            </span>
          ),
      },
      {
        key: "createdAt",
        header: "Filed",
        cell: (item) => (
          <span className="text-[11px] text-muted-foreground">
            {formatDate(item.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        header: <span className="sr-only">Details</span>,
        className: "text-right w-12",
        cell: () => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [showEscalationBanner]
  );

  return (
    <DataTable
      columns={columns}
      data={complaints}
      keyExtractor={(item) => item.id}
      onRowClick={onSelectComplaint}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}
