"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ApplicationCard } from "./application-card";
import { staffApplicationService } from "@/services/staff-application.service";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/axios";
import type { Department } from "@/types/department";
import type { StaffApplication } from "@/types/user";
import type { PaginatedData } from "@/types/api";
import { cn } from "@/lib/utils";

type ApplicationTab = "PENDING" | "APPROVED" | "REJECTED";

export function ApplicationsView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { getParam, setParams } = useUrlState();

  const statusTab = (getParam("status", "PENDING") as ApplicationTab) || "PENDING";
  const page = Number(getParam("page", "1")) || 1;

  // Local state for locally decided applications within this session
  const [decidedHistory, setDecidedHistory] = React.useState<StaffApplication[]>([]);

  // 1. Fetch departments to resolve real department names
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: () => publicService.getDepartments(),
  });

  const departmentsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    departments.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [departments]);

  // Fetch pending applications (the backend GET /staff-applications returns pending applications scoped to manager's department)
  const { data: applicationsData, isLoading } = useQuery({
    queryKey: queryKeys.staffApplications.list({ page, limit: 10 }),
    queryFn: () => staffApplicationService.getApplications({ page, limit: 10 }),
  });

  const managerDeptName =
    user?.department?.name ||
    (user?.departmentId ? departmentsMap.get(user.departmentId) : null) ||
    "Department";

  // Decide mutation with optimistic update
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
        queryKeys.staffApplications.list({ page, limit: 10 })
      );

      const target = prevData?.items.find((item) => item.id === id);

      // Optimistically remove card from pending tab
      if (prevData) {
        queryClient.setQueryData<PaginatedData<StaffApplication>>(
          queryKeys.staffApplications.list({ page, limit: 10 }),
          {
            ...prevData,
            total: Math.max(0, prevData.total - 1),
            items: prevData.items.filter((item) => item.id !== id),
          }
        );
      }

      // Add to session decided history
      if (target) {
        setDecidedHistory((prev) => [
          {
            ...target,
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
          queryKeys.staffApplications.list({ page, limit: 10 }),
          context.prevData
        );
      }
      toast.error(getErrorMessage(err) || "Failed to process application.");
    },
    onSuccess: (updatedUser, variables) => {
      if (variables.decision === "APPROVED") {
        toast.success(`${updatedUser.name} is now a Technician`);
      } else {
        toast.success("Application rejected");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.staffApplications.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.all,
      });
    },
  });

  const handleApprove = async (id: string) => {
    await decideMutation.mutateAsync({ id, decision: "APPROVED" });
  };

  const handleReject = async (id: string, reason: string) => {
    await decideMutation.mutateAsync({ id, decision: "REJECTED", reason });
  };

  const handleTabChange = (tab: ApplicationTab) => {
    setParams({
      status: tab === "PENDING" ? null : tab,
      page: null,
    });
  };

  // Select items to display depending on tab
  const pendingItems = applicationsData?.items || [];
  const totalPages = applicationsData?.totalPages || 1;
  const total = applicationsData?.total || 0;

  const currentTabItems =
    statusTab === "PENDING"
      ? pendingItems
      : decidedHistory.filter((item) => item.approvalStatus === statusTab);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={`${managerDeptName !== "Department" ? managerDeptName : "Staff"} — Applications`}
        description="Review candidate credentials and appoint qualified applicants to active field technician roles."
      />

      {/* Tabs Bar synced to URL */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-px">
        <button
          type="button"
          onClick={() => handleTabChange("PENDING")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px",
            statusTab === "PENDING"
              ? "border-violet-500 text-violet-600 dark:text-violet-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Clock className="size-4" />
          Pending Review
          {pendingItems.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-600 dark:text-violet-400">
              {pendingItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("APPROVED")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px",
            statusTab === "APPROVED"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <CheckCircle2 className="size-4" />
          Approved Roster
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("REJECTED")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px",
            statusTab === "REJECTED"
              ? "border-rose-500 text-rose-600 dark:text-rose-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <XCircle className="size-4" />
          Rejected
        </button>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-44 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
          <div className="h-44 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
        </div>
      ) : currentTabItems.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={
            statusTab === "PENDING"
              ? "No pending staff applications 🎉"
              : statusTab === "APPROVED"
              ? "No approved applications in this session"
              : "No rejected applications"
          }
          description={
            statusTab === "PENDING"
              ? "All technician applications for your department have been reviewed."
              : statusTab === "APPROVED"
              ? "Decided candidates are cleared and added directly to your field team."
              : "No applications have been rejected in your department session."
          }
        />
      ) : (
        <div className="space-y-4">
          {currentTabItems.map((application) => {
            const resolvedDeptName =
              application.department?.name ||
              (application.departmentId ? departmentsMap.get(application.departmentId) : null) ||
              (managerDeptName !== "Department" ? managerDeptName : "Municipal Operations");

            return (
              <ApplicationCard
                key={application.id}
                application={application}
                departmentName={resolvedDeptName}
                onApprove={handleApprove}
                onReject={handleReject}
                isMutating={decideMutation.isPending}
              />
            );
          })}

          {/* Pagination for PENDING tab */}
          {statusTab === "PENDING" && totalPages > 1 && (
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
      )}
    </div>
  );
}
