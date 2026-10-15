"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, FilterX, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterSelect } from "@/components/shared/filter-select";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import type { Department } from "@/types/department";
import { cn } from "@/lib/utils";

interface ApplicationsFiltersProps {
  status: "PENDING" | "APPROVED" | "REJECTED";
  onStatusChange: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  pendingCount?: number;
}

export function ApplicationsFilters({
  status,
  onStatusChange,
  onClear,
  hasActiveFilters,
  pendingCount = 0,
}: ApplicationsFiltersProps) {
  // Fetch all departments for filter dropdown
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: () => departmentService.getDepartments(),
  });

  const departmentOptions = React.useMemo(() => {
    return departments.map((d) => ({ label: d.name, value: d.id }));
  }, [departments]);

  const roleOptions = [
    { label: "Technician", value: "TECHNICIAN" },
    { label: "Manager", value: "MANAGER" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/40">
          <button
            type="button"
            onClick={() => onStatusChange("PENDING")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              status === "PENDING"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="size-3.5 text-amber-500" />
            <span>Pending Review</span>
            {pendingCount > 0 && (
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"
              >
                {pendingCount}
              </Badge>
            )}
          </button>

          <button
            type="button"
            onClick={() => onStatusChange("APPROVED")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              status === "APPROVED"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CheckCircle2 className="size-3.5 text-emerald-500" />
            <span>Approved</span>
          </button>

          <button
            type="button"
            onClick={() => onStatusChange("REJECTED")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              status === "REJECTED"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <XCircle className="size-3.5 text-destructive" />
            <span>Rejected</span>
          </button>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive h-8 px-2.5 gap-1.5"
          >
            <FilterX className="size-3.5" />
            <span>Clear filters</span>
          </Button>
        )}
      </div>

      {/* 2. Secondary Dropdown Filters synced to URL state */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          paramKey="role"
          options={roleOptions}
          placeholder="Filter by role"
          allLabel="All Roles"
          className="w-44 text-xs"
        />

        <FilterSelect
          paramKey="departmentId"
          options={departmentOptions}
          placeholder="Filter by department"
          allLabel="All Departments"
          className="w-56 text-xs"
        />
      </div>
    </div>
  );
}
