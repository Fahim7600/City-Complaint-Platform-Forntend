"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ApplicationsFilters } from "./applications-filters";
import { ApplicationCard } from "@/components/manager/application-card";
import { staffApplicationService } from "@/services/staff-application.service";
import { adminService } from "@/services/admin.service";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { getErrorMessage } from "@/lib/axios";
import type { Department } from "@/types/department";
import type { Role, StaffApplication, User } from "@/types/user";
import type { PaginatedData } from "@/types/api";

type ApplicationTab = "PENDING" | "APPROVED" | "REJECTED";
const PAGE_LIMIT = 10;

export function ApplicationsView() {
  const queryClient = useQueryClient();
  const { getParam, getNumberParam, setParams } = useUrlState();

  const statusTab = (getParam("status", "PENDING") as ApplicationTab) || "PENDING";
  const roleFilter = getParam("role", "");
  const departmentFilter = getParam("departmentId", "");
  const currentPage = getNumberParam("page", 1);

  // Local session history of decided applications
  const [decidedHistory, setDecidedHistory] = React.useState<(StaffApplication | User)[]>([]);

  // 1. Fetch departments to resolve department names
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: () => departmentService.getDepartments(),
  });

  const departmentsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    departments.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [departments]);

  // 2. Fetch active managers to detect if a department already has a manager assigned
  const { data: managersData } = useQuery({
    queryKey: queryKeys.users.list({ role: "MANAGER", limit: 100 }),
    queryFn: () => adminService.getUsers({ role: "MANAGER", limit: 100 }),
  });

  const activeManagersMap = React.useMemo(() => {
    const map = new Map<string, string>();
    managersData?.items.forEach((m) => {
      if (m.departmentId && !m.deletedAt) {
        map.set(m.departmentId, m.name);
      }
    });
    return map;
  }, [managersData]);

  // 3. Pending applications query
  const isPendingTab = statusTab === "PENDING";
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    refetch: refetchPending,
  } = useQuery({
    queryKey: queryKeys.staffApplications.list({ page: currentPage, limit: PAGE_LIMIT }),
    queryFn: () => staffApplicationService.getApplications({ page: currentPage, limit: PAGE_LIMIT }),
    enabled: isPendingTab,
  });

  // 4. Decided (Approved / Rejected) query via Admin users endpoint
  const {
    data: decidedData,
    isLoading: isDecidedLoading,
    isError: isDecidedError,
    refetch: refetchDecided,
  } = useQuery({
    queryKey: queryKeys.users.list({
      approvalStatus: statusTab as "APPROVED" | "REJECTED",
      role: roleFilter ? (roleFilter as Role) : undefined,
      departmentId: departmentFilter || undefined,
      page: currentPage,
      limit: PAGE_LIMIT,
    }),
    queryFn: () =>
      adminService.getUsers({
        approvalStatus: statusTab as "APPROVED" | "REJECTED",
        role: roleFilter ? (roleFilter as Role) : undefined,
        departmentId: departmentFilter || undefined,
        page: currentPage,
        limit: PAGE_LIMIT,
      }),
    enabled: !isPendingTab,
  });

  // Filter pending items by role & department if applied
  const rawPendingItems = React.useMemo<StaffApplication[]>(() => pendingData?.items || [], [pendingData?.items]);
  const displayedPendingItems = React.useMemo(() => {
    return rawPendingItems.filter((item) => {
      if (roleFilter && item.requestedRole !== roleFilter) return false;
      if (departmentFilter && item.departmentId !== departmentFilter) return false;
      return true;
    });
  }, [rawPendingItems, roleFilter, departmentFilter]);

  // Filter decided history from current session
  const sessionDecidedMatches = React.useMemo(() => {
    return decidedHistory.filter((item) => {
      if (item.approvalStatus !== statusTab) return false;
      if (roleFilter && item.role !== roleFilter && item.requestedRole !== roleFilter) return false;
      if (departmentFilter && item.departmentId !== departmentFilter) return false;
      return true;
    });
  }, [decidedHistory, statusTab, roleFilter, departmentFilter]);

  const rawDecidedItems = React.useMemo<User[]>(() => decidedData?.items || [], [decidedData?.items]);
  const displayedDecidedItems = React.useMemo(() => {
    const existingIds = new Set(rawDecidedItems.map((u) => u.id));
    const newlyDecided = sessionDecidedMatches.filter((u) => !existingIds.has(u.id));
    return [...newlyDecided, ...rawDecidedItems];
  }, [rawDecidedItems, sessionDecidedMatches]);

  const displayedItems = isPendingTab ? displayedPendingItems : displayedDecidedItems;
  const isLoading = isPendingTab ? isPendingLoading : isDecidedLoading;
  const isError = isPendingTab ? isPendingError : isDecidedError;
  const totalPages = isPendingTab ? pendingData?.totalPages || 1 : decidedData?.totalPages || 1;
  const totalCount = isPendingTab ? pendingData?.total || 0 : (decidedData?.total || 0) + sessionDecidedMatches.length;
  const pendingBadgeCount = pendingData?.total || 0;

  // Decide Mutation with optimistic rollback
  const decideMutation = useMutation({
    mutationFn: ({
      id,
      decision,
      reason,
    }: {
      id: string;
      decision: "APPROVED" | "REJECTED";
      reason?: string;
    }) => staffApplicationService.decide(id, { decision, reason }),
    onMutate: async ({ id, decision }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.staffApplications.all,
      });

      const prevData = queryClient.getQueryData<PaginatedData<StaffApplication>>(
        queryKeys.staffApplications.list({ page: currentPage, limit: PAGE_LIMIT })
      );

      const target = prevData?.items.find((item) => item.id === id);

      if (prevData) {
        queryClient.setQueryData<PaginatedData<StaffApplication>>(
          queryKeys.staffApplications.list({ page: currentPage, limit: PAGE_LIMIT }),
          {
            ...prevData,
            total: Math.max(0, prevData.total - 1),
            items: prevData.items.filter((item) => item.id !== id),
          }
        );
      }

      if (target) {
        setDecidedHistory((prev) => [
          {
            ...target,
            role: decision === "APPROVED" && target.requestedRole ? target.requestedRole : target.role,
            approvalStatus: decision,
            decidedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      return { prevData };
    },
    onError: (err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(
          queryKeys.staffApplications.list({ page: currentPage, limit: PAGE_LIMIT }),
          context.prevData
        );
      }
      toast.error(getErrorMessage(err) || "Failed to process application.");
    },
    onSuccess: (updatedUser, variables) => {
      if (variables.decision === "APPROVED") {
        toast.success(
          `${updatedUser.name} appointed as ${updatedUser.role || "Staff Member"}`
        );
      } else {
        toast.success("Application rejected");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staffApplications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
    },
  });

  const handleApprove = async (id: string) => {
    await decideMutation.mutateAsync({ id, decision: "APPROVED" });
  };

  const handleReject = async (id: string, reason: string) => {
    await decideMutation.mutateAsync({ id, decision: "REJECTED", reason });
  };

  const hasActiveFilters = Boolean(roleFilter || departmentFilter || statusTab !== "PENDING");

  const handleClearFilters = () => {
    setParams({
      status: "PENDING",
      role: undefined,
      departmentId: undefined,
      page: 1,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Page Header */}
      <PageHeader
        title="Staff Applications Review"
        description="Evaluate municipal staff candidacies across all city departments. Review qualifications and authorize Technician or Department Manager appointments."
      />

      {/* 2. Tabs & Filters */}
      <ApplicationsFilters
        status={statusTab}
        onStatusChange={(st) => setParams({ status: st, page: 1 })}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        pendingCount={pendingBadgeCount}
      />

      {/* 3. List or Skeletons or Error */}
      {isError ? (
        <div className="py-20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load staff applications
          </p>
          <button
            onClick={() => (isPendingTab ? refetchPending() : refetchDecided())}
            className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Retry query
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-44 rounded-2xl border border-border/50 bg-card/40 animate-pulse"
            />
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <EmptyState
          icon={statusTab === "PENDING" ? UserCheck : statusTab === "APPROVED" ? CheckCircle2 : XCircle}
          title={
            hasActiveFilters
              ? "No applications match your filters"
              : statusTab === "PENDING"
              ? "No pending staff applications"
              : `No ${statusTab.toLowerCase()} applications`
          }
          description={
            hasActiveFilters
              ? "Try adjusting your role or department filter selections."
              : statusTab === "PENDING"
              ? "There are currently no candidate applications awaiting administrative review."
              : `Applications that have been ${statusTab.toLowerCase()} will appear here.`
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
      ) : (
        <div className="space-y-4">
          {displayedItems.map((application) => {
            const deptName =
              (application.departmentId && departmentsMap.get(application.departmentId)) ||
              application.department?.name ||
              "General Operations";

            const existingManager = application.departmentId
              ? activeManagersMap.get(application.departmentId)
              : null;

            return (
              <ApplicationCard
                key={application.id}
                application={application}
                departmentName={deptName}
                onApprove={handleApprove}
                onReject={handleReject}
                isMutating={decideMutation.isPending}
                isAdmin={true}
                existingManagerName={existingManager}
              />
            );
          })}

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
    </div>
  );
}
