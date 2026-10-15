"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { DepartmentCard } from "./department-card";
import { DepartmentDialog } from "./department-dialog";
import { DepartmentDetailSheet } from "./department-detail-sheet";
import { adminService } from "@/services/admin.service";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import type { Department } from "@/types/department";

export function DepartmentsView() {
  const { getParam, setParam } = useUrlState();

  const q = getParam("q", "");
  const selectedDeptId = getParam("id", "");

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null);

  // 1. Fetch departments
  const {
    data: departments = [],
    isLoading: isDeptsLoading,
    isError,
    refetch,
  } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: () => adminService.getDepartments(false),
  });

  // 2. Fetch dashboard stats for open complaints & technician counts per department
  const { data: dashboardStats } = useQuery({
    queryKey: queryKeys.admin.dashboardStats(),
    queryFn: () => adminService.getDashboardStats(),
  });

  const departmentStatsMap = React.useMemo(() => {
    const map = new Map<
      string,
      { openCount: number; resolvedCount: number; technicianCount: number }
    >();
    dashboardStats?.departments?.forEach((item) => {
      const openCount =
        (item.complaintsByStatus?.PENDING || 0) +
        (item.complaintsByStatus?.ASSIGNED || 0) +
        (item.complaintsByStatus?.IN_PROGRESS || 0);
      const resolvedCount =
        (item.complaintsByStatus?.RESOLVED || 0) +
        (item.complaintsByStatus?.CLOSED || 0);

      map.set(item.departmentId, {
        openCount,
        resolvedCount,
        technicianCount: item.technicianCount,
      });
    });
    return map;
  }, [dashboardStats]);

  // 3. Fetch managers to map manager names
  const { data: managersData } = useQuery({
    queryKey: queryKeys.users.list({ role: "MANAGER", limit: 100 }),
    queryFn: () => adminService.getUsers({ role: "MANAGER", limit: 100 }),
  });

  const managersMap = React.useMemo(() => {
    const map = new Map<string, string>();
    managersData?.items.forEach((m) => {
      if (m.departmentId && !m.deletedAt) {
        map.set(m.departmentId, m.name);
      }
    });
    return map;
  }, [managersData]);

  // 4. Fetch all categories to compute category count per department
  const { data: allCategories = [] } = useQuery({
    queryKey: queryKeys.categories.publicList(),
    queryFn: () => publicService.getCategories(),
  });

  const categoryCountMap = React.useMemo(() => {
    const map = new Map<string, number>();
    allCategories.forEach((cat) => {
      if (cat.departmentId) {
        map.set(cat.departmentId, (map.get(cat.departmentId) || 0) + 1);
      }
    });
    return map;
  }, [allCategories]);

  // Filter departments by client query `?q=`
  const filteredDepartments = React.useMemo(() => {
    if (!q.trim()) return departments;
    const term = q.toLowerCase().trim();
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term))
    );
  }, [departments, q]);

  const selectedDepartment = React.useMemo(() => {
    if (!selectedDeptId) return null;
    return departments.find((d) => d.id === selectedDeptId) || null;
  }, [departments, selectedDeptId]);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header with New Department Neon Button */}
      <PageHeader
        title="Municipal Departments"
        description="Configure municipal divisions, manage operational service boundaries, inspect technician rosters, and monitor active departmental queues."
        actions={
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/25 gap-1.5"
          >
            <Plus className="size-4" />
            New Department
          </Button>
        }
      />

      {/* 2. Search Bar */}
      <div className="max-w-md">
        <SearchInput
          defaultValue={q}
          placeholder="Search departments by name or description..."
          className="h-10 text-xs"
        />
      </div>

      {/* 3. Grid of Cards or Skeletons or Error */}
      {isError ? (
        <div className="py-20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load municipal departments
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Retry query
          </button>
        </div>
      ) : isDeptsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-56 rounded-2xl border border-border/50 bg-card/40 animate-pulse"
            />
          ))}
        </div>
      ) : filteredDepartments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={q.trim() ? "No departments found" : "No departments registered"}
          description={
            q.trim()
              ? `No municipal divisions matched your search query "${q}". Try a different keyword.`
              : "Create the first municipal division to enable category creation and ticket triage."
          }
          action={
            q.trim()
              ? {
                  label: "Clear search",
                  onClick: () => setParam("q", null),
                }
              : {
                  label: "Create Department",
                  onClick: () => setCreateDialogOpen(true),
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            const stats = departmentStatsMap.get(dept.id);
            const catCount = categoryCountMap.get(dept.id) || 0;
            const techCount = stats?.technicianCount || 0;
            const openTickets = stats?.openCount || 0;
            const manager = managersMap.get(dept.id);

            return (
              <DepartmentCard
                key={dept.id}
                department={dept}
                categoryCount={catCount}
                technicianCount={techCount}
                openComplaintCount={openTickets}
                managerName={manager}
                onSelect={(d) => setParam("id", d.id)}
                onEdit={(d) => setEditingDepartment(d)}
              />
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <DepartmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit Dialog */}
      <DepartmentDialog
        open={Boolean(editingDepartment)}
        onOpenChange={(open) => {
          if (!open) setEditingDepartment(null);
        }}
        department={editingDepartment}
      />

      {/* Detail Sheet */}
      <DepartmentDetailSheet
        department={selectedDepartment}
        open={Boolean(selectedDepartment)}
        onOpenChange={(open) => {
          if (!open) setParam("id", null);
        }}
      />
    </div>
  );
}
