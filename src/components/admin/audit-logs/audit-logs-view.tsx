"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Download,
  FilterX,
  History,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import { AuditLogsTable } from "./audit-logs-table";
import { AuditLogDetailSheet } from "./audit-log-detail-sheet";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import type { AuditLog, AuditLogQuery } from "@/types/audit-log";

const PAGE_LIMIT = 20;

const ENTITY_OPTIONS = [
  { label: "Complaint", value: "Complaint" },
  { label: "User Account", value: "User" },
  { label: "Department", value: "Department" },
  { label: "Service Category", value: "Category" },
];

const ACTION_OPTIONS = [
  { label: "Complaint Created", value: "COMPLAINT_CREATED" },
  { label: "Status Changed", value: "COMPLAINT_STATUS_CHANGED" },
  { label: "Technician Assigned", value: "COMPLAINT_ASSIGNED" },
  { label: "Escalated to Admin", value: "COMPLAINT_ESCALATED" },
  { label: "Escalation Cleared", value: "COMPLAINT_ESCALATION_CLEARED" },
  { label: "Complaint Deleted", value: "COMPLAINT_DELETED" },
  { label: "User Deactivated", value: "USER_DEACTIVATED" },
  { label: "User Reactivated", value: "USER_REACTIVATED" },
  { label: "Role Overridden", value: "ROLE_OVERRIDDEN" },
  { label: "Department Created", value: "DEPARTMENT_CREATED" },
  { label: "Department Updated", value: "DEPARTMENT_UPDATED" },
  { label: "Department Deleted", value: "DEPARTMENT_DELETED" },
  { label: "Category Created", value: "CATEGORY_CREATED" },
  { label: "Category Updated", value: "CATEGORY_UPDATED" },
  { label: "Category Deleted", value: "CATEGORY_DELETED" },
  { label: "Staff App Approved", value: "STAFF_APPLICATION_APPROVED" },
  { label: "Staff App Rejected", value: "STAFF_APPLICATION_REJECTED" },
];

export function AuditLogsView() {
  const { getParam, getNumberParam, setParam, setParams } = useUrlState();

  const action = getParam("action", "");
  const entityType = getParam("entityType", "");
  const actorId = getParam("actorId", "");
  const selectedLogId = getParam("id", "");
  const currentPage = getNumberParam("page", 1);

  const queryParams: AuditLogQuery = {
    page: currentPage,
    limit: PAGE_LIMIT,
    action: action || undefined,
    entityType: entityType || undefined,
    actorId: actorId || undefined,
  };

  // 1. Fetch Audit Logs
  const {
    data: auditData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.auditLogs(queryParams),
    queryFn: () => adminService.getAuditLogs(queryParams),
  });

  const logs = React.useMemo<AuditLog[]>(() => auditData?.items || [], [auditData?.items]);
  const totalPages = auditData?.totalPages || 1;
  const totalCount = auditData?.total || 0;

  const selectedLog = React.useMemo(() => {
    if (!selectedLogId) return null;
    return logs.find((l) => l.id === selectedLogId) || null;
  }, [logs, selectedLogId]);

  // Export CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      toast.error("No audit logs to export.");
      return;
    }

    const headers = [
      "Log ID",
      "Timestamp",
      "Actor ID",
      "Actor Name",
      "Actor Email",
      "Action",
      "Entity Type",
      "Entity ID",
      "Metadata JSON",
    ];

    const rows = logs.map((l) => {
      const meta = l.metadata ? JSON.stringify(l.metadata).replace(/"/g, '""') : "";
      return [
        `"${l.id}"`,
        `"${l.createdAt}"`,
        `"${l.actorId}"`,
        `"${l.actor?.name || ""}"`,
        `"${l.actor?.email || ""}"`,
        `"${l.action}"`,
        `"${l.entityType}"`,
        `"${l.entityId}"`,
        `"${meta}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute("download", `audit-logs-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${logs.length} audit logs`);
  };

  const hasActiveFilters = Boolean(action || entityType || actorId);

  const handleClearFilters = () => {
    setParams({
      action: undefined,
      entityType: undefined,
      actorId: undefined,
      page: 1,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header with Export CSV action */}
      <PageHeader
        title="Audit Log &amp; Activity Stream"
        description="Immutable system ledger recording administrative actions, role modifications, status transitions, and department reconfigurations."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        }
      />

      {/* 2. Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <FilterSelect
            paramKey="action"
            options={ACTION_OPTIONS}
            placeholder="Filter by action"
            allLabel="All Actions"
            className="w-56 text-xs"
          />

          <FilterSelect
            paramKey="entityType"
            options={ENTITY_OPTIONS}
            placeholder="Filter by entity"
            allLabel="All Entities"
            className="w-48 text-xs"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-destructive h-9 px-2.5 gap-1.5"
          >
            <FilterX className="size-3.5" />
            <span>Clear filters</span>
          </Button>
        )}
      </div>

      {/* 3. Table or Error */}
      {isError ? (
        <div className="py-20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load audit trail
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Retry query
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AuditLogsTable
            logs={logs}
            isLoading={isLoading}
            onSelectLog={(l) => setParam("id", l.id)}
            emptyState={
              <EmptyState
                icon={History}
                title={hasActiveFilters ? "No audit logs match your filters" : "No audit records found"}
                description={
                  hasActiveFilters
                    ? "Try adjusting your action or entity filter selections."
                    : "Administrative and operational audit events will be recorded here automatically."
                }
                action={
                  hasActiveFilters
                    ? {
                        label: "Clear filters",
                        onClick: handleClearFilters,
                      }
                    : undefined
                }
              />
            }
          />

          {/* 4. Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              meta={{
                page: currentPage,
                totalPages,
                total: totalCount,
                limit: PAGE_LIMIT,
              }}
            />
          )}
        </div>
      )}

      {/* Detail Sheet */}
      <AuditLogDetailSheet
        log={selectedLog}
        open={Boolean(selectedLog)}
        onOpenChange={(open) => {
          if (!open) setParam("id", null);
        }}
      />
    </div>
  );
}
