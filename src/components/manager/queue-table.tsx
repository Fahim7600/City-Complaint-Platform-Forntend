"use client";

import * as React from "react";
import { Crown, Inbox, RotateCcw, Sparkles } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QueueSlaChip } from "./queue-sla-chip";
import { useUrlState } from "@/hooks/use-url-state";
import type { Complaint } from "@/types/complaint";
import type { PaginatedData } from "@/types/api";

interface QueueTableProps {
  data?: PaginatedData<Complaint>;
  isLoading: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onSelectComplaint: (complaintId: string) => void;
}

export function QueueTable({
  data,
  isLoading,
  hasActiveFilters,
  onClearFilters,
  onSelectComplaint,
}: QueueTableProps) {
  const { getParam } = useUrlState();
  const page = Number(getParam("page", "1")) || 1;

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const columns: ColumnDef<Complaint>[] = React.useMemo(
    () => [
      {
        key: "complaint",
        header: "Complaint",
        cell: (item) => (
          <div className="space-y-1 max-w-xs sm:max-w-sm">
            <span className="font-bold text-foreground text-xs block line-clamp-1 group-hover:text-violet-500 transition-colors">
              {item.title}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
              <span>#{item.id.slice(0, 8)}</span>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        cell: (item) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/60 text-muted-foreground border border-border/50">
            {item.category?.name || "General"}
          </span>
        ),
      },
      {
        key: "citizen",
        header: "Citizen",
        cell: (item) => (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-foreground">
              {item.citizen?.name || "Citizen"}
            </span>
            {item.citizen?.isPremium && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Crown className="size-2.5 fill-amber-500" />
                PRO
              </span>
            )}
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
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={item.status} />
            {item.isEscalated && <StatusBadge isEscalated />}
          </div>
        ),
      },
      {
        key: "technician",
        header: "Assigned Tech",
        cell: (item) => {
          if (!item.assignedTechnician) {
            return (
              <span className="text-xs text-muted-foreground/80 italic">
                Unassigned
              </span>
            );
          }
          return (
            <div className="flex items-center gap-2">
              <Avatar className="size-6 rounded-md border border-border/60">
                {item.assignedTechnician.avatarUrl && (
                  <AvatarImage
                    src={item.assignedTechnician.avatarUrl}
                    alt={item.assignedTechnician.name}
                  />
                )}
                <AvatarFallback className="rounded-md bg-violet-500/15 text-violet-600 font-bold text-[10px]">
                  {item.assignedTechnician.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                {item.assignedTechnician.name}
              </span>
            </div>
          );
        },
      },
      {
        key: "sla",
        header: "SLA Due",
        cell: (item) => (
          <QueueSlaChip slaDueAt={item.slaDueAt} status={item.status} />
        ),
      },
    ],
    []
  );

  const emptyState = hasActiveFilters ? (
    <EmptyState
      icon={Inbox}
      title="No matching complaints"
      description="No complaints in your department queue match the active search or filter criteria."
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-xs"
        >
          <RotateCcw className="size-3.5 mr-1.5" />
          Clear all filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={Sparkles}
      title="No complaints in your department queue 🎉"
      description="All municipal tickets have been assigned or resolved. Outstanding service!"
    />
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.id}
        onRowClick={(item) => onSelectComplaint(item.id)}
        isLoading={isLoading}
        emptyState={emptyState}
      />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <PaginationControls
          meta={{
            page,
            totalPages,
            total,
            limit: 10,
          }}
        />
      )}
    </div>
  );
}
