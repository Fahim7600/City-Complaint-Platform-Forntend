"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FileText, RefreshCw, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ComplaintsFilters } from "./complaints-filters";
import { ComplaintsTable } from "./complaints-table";
import { ComplaintSheet } from "@/components/manager/complaint-sheet";
import { complaintService } from "@/services/complaint.service";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { ComplaintStatus, Priority, type Complaint, type ComplaintListQuery } from "@/types/complaint";

const PAGE_LIMIT = 10;

export function ComplaintsView() {
  const { getParam, getNumberParam, setParam, setParams } = useUrlState();

  const tab = getParam("tab", "all");
  const q = getParam("q", "");
  const status = getParam("status", "");
  const priority = getParam("priority", "");
  const departmentId = getParam("departmentId", "");
  const categoryId = getParam("categoryId", "");
  const sort = getParam("sort", "newest");
  const selectedComplaintId = getParam("id", "");
  const currentPage = getNumberParam("page", 1);

  // Fetch escalated count for badge
  const { data: escalatedMeta } = useQuery({
    queryKey: queryKeys.admin.escalatedComplaints({ limit: 1 }),
    queryFn: () => adminService.getEscalatedComplaints({ limit: 1 }),
  });
  const escalatedCount = escalatedMeta?.total ?? 0;

  // Main complaints query based on active tab
  const isEscalatedTab = tab === "escalated";
  const isOverdueTab = tab === "overdue";

  const listParams: ComplaintListQuery = {
    page: currentPage,
    limit: PAGE_LIMIT,
    q: q.trim() || undefined,
    status: !isOverdueTab && status ? (status as ComplaintStatus) : undefined,
    priority: priority ? (priority as Priority) : undefined,
    categoryId: categoryId || undefined,
    overdue: isOverdueTab ? true : undefined,
    sortBy: sort === "sla" ? "slaDueAt" : sort === "priority" ? "priority" : "createdAt",
    sortOrder: sort === "sla" ? "asc" : "desc",
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: isEscalatedTab
      ? queryKeys.admin.escalatedComplaints({ page: currentPage, limit: PAGE_LIMIT })
      : queryKeys.complaints.list(listParams),
    queryFn: () =>
      isEscalatedTab
        ? adminService.getEscalatedComplaints({ page: currentPage, limit: PAGE_LIMIT })
        : complaintService.getMy(listParams),
  });

  const rawComplaints = React.useMemo<Complaint[]>(() => data?.items || [], [data?.items]);

  // Department is filtered on the current page if specified
  const displayedComplaints = React.useMemo(() => {
    if (!departmentId) return rawComplaints;
    return rawComplaints.filter((c) => c.departmentId === departmentId);
  }, [rawComplaints, departmentId]);

  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  const hasActiveFilters = Boolean(
    q.trim() ||
      status ||
      priority ||
      departmentId ||
      categoryId ||
      sort !== "newest" ||
      tab !== "all"
  );

  const handleClearFilters = () => {
    setParams({
      tab: "all",
      q: undefined,
      status: undefined,
      priority: undefined,
      departmentId: undefined,
      categoryId: undefined,
      sort: undefined,
      page: 1,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <PageHeader
        title="All complaints & escalations"
        description="Comprehensive citywide incident queue, administrative triage, reassignments, and escalation remediation."
      />

      {/* 2. Tabs & Filters */}
      <ComplaintsFilters
        tab={tab}
        onTabChange={(t) => setParams({ tab: t, page: 1 })}
        q={q}
        onQChange={(query) => setParams({ q: query, page: 1 })}
        status={status}
        onStatusChange={(st) => setParams({ status: st, page: 1 })}
        priority={priority}
        onPriorityChange={(pr) => setParams({ priority: pr, page: 1 })}
        departmentId={departmentId}
        onDepartmentChange={(dept) => setParams({ departmentId: dept, categoryId: undefined, page: 1 })}
        categoryId={categoryId}
        onCategoryChange={(cat) => setParams({ categoryId: cat, page: 1 })}
        sort={sort}
        onSortChange={(s) => setParams({ sort: s, page: 1 })}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        escalatedCount={escalatedCount}
      />

      {/* 3. Table or Error */}
      {isError ? (
        <div className="py-20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load complaints queue
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
          <ComplaintsTable
            complaints={displayedComplaints}
            isLoading={isLoading}
            onSelectComplaint={(c) => setParam("id", c.id)}
            showEscalationBanner={isEscalatedTab}
            emptyState={
              <EmptyState
                icon={isEscalatedTab ? ShieldAlert : FileText}
                title={
                  isEscalatedTab
                    ? "No escalated complaints"
                    : hasActiveFilters
                    ? "No complaints match your filters"
                    : "No complaints filed yet"
                }
                description={
                  isEscalatedTab
                    ? "There are currently no complaints flagged for administrator intervention."
                    : hasActiveFilters
                    ? "Try adjusting your query, priority, or clearing your filter selection."
                    : "Citizen incident reports will appear here for oversight and triage."
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

      {/* Shared Complaint Sheet (Generalised for Admin) */}
      <ComplaintSheet
        complaintId={selectedComplaintId || null}
        open={Boolean(selectedComplaintId)}
        onOpenChange={(open) => {
          if (!open) setParam("id", null);
        }}
      />
    </div>
  );
}
