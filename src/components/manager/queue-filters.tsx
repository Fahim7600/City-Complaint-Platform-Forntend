"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RotateCcw, SlidersHorizontal, UserX } from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hooks/use-url-state";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/hooks/use-auth";
import { ComplaintStatus, Priority } from "@/types/complaint";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: ComplaintStatus.PENDING, label: "Pending (Unassigned)" },
  { value: ComplaintStatus.ASSIGNED, label: "Assigned" },
  { value: ComplaintStatus.IN_PROGRESS, label: "In Progress" },
  { value: ComplaintStatus.RESOLVED, label: "Resolved" },
  { value: ComplaintStatus.CLOSED, label: "Closed" },
  { value: ComplaintStatus.REJECTED, label: "Rejected" },
  { value: ComplaintStatus.CANCELLED, label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
  { value: Priority.HIGH, label: "High Priority" },
  { value: Priority.MEDIUM, label: "Medium Priority" },
  { value: Priority.LOW, label: "Low Priority" },
];

const SORT_OPTIONS = [
  { value: "sla", label: "SLA Due Soonest (Default)" },
  { value: "newest", label: "Newest First" },
  { value: "priority", label: "Highest Priority" },
];

export function QueueFilters() {
  const { user } = useAuth();
  const { getParam, setParams } = useUrlState();

  const q = getParam("q", "");
  const status = getParam("status");
  const priority = getParam("priority");
  const categoryId = getParam("categoryId");
  const sort = getParam("sort", "sla");
  const escalated = getParam("escalated") === "true";
  const unassigned = getParam("unassigned") === "true";

  // Fetch categories for filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.publicList(),
    queryFn: () => publicService.getCategories(),
  });

  // Filter to this manager's department's categories if departmentId is available
  const departmentCategories = React.useMemo(() => {
    if (!user?.departmentId) return categories;
    const filtered = categories.filter(
      (cat) => cat.departmentId === user.departmentId
    );
    return filtered.length > 0 ? filtered : categories;
  }, [categories, user?.departmentId]);

  const categoryOptions = React.useMemo(() => {
    return departmentCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [departmentCategories]);

  const hasActiveFilters =
    Boolean(q) ||
    Boolean(status) ||
    Boolean(priority) ||
    Boolean(categoryId) ||
    (Boolean(sort) && sort !== "sla") ||
    escalated ||
    unassigned;

  const handleClearFilters = () => {
    setParams({
      q: null,
      status: null,
      priority: null,
      categoryId: null,
      sort: null,
      unassigned: null,
      escalated: null,
      page: null,
    });
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            value={q}
            onChange={(val) => setParams({ q: val || null, page: null })}
            placeholder="Search complaints by title, description..."
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-48">
          <FilterSelect
            paramKey="status"
            options={STATUS_OPTIONS}
            placeholder="Status"
            allLabel="All Statuses"
          />
        </div>

        {/* Priority Filter */}
        <div className="w-full sm:w-44">
          <FilterSelect
            paramKey="priority"
            options={PRIORITY_OPTIONS}
            placeholder="Priority"
            allLabel="All Priorities"
          />
        </div>

        {/* Category Filter (scoped to this department) */}
        <div className="w-full sm:w-48">
          <FilterSelect
            paramKey="categoryId"
            options={categoryOptions}
            placeholder="Category"
            allLabel="All Categories"
          />
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-52">
          <FilterSelect
            paramKey="sort"
            options={SORT_OPTIONS}
            placeholder="Sort by"
            allLabel="SLA Due Soonest"
          />
        </div>
      </div>

      {/* Quick Toggle Chips & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal className="size-3" />
            Quick views:
          </span>

          {/* Unassigned Quick Toggle */}
          <button
            type="button"
            onClick={() =>
              setParams({
                unassigned: unassigned ? null : "true",
                status: unassigned ? null : ComplaintStatus.PENDING,
                page: null,
              })
            }
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border",
              unassigned || status === ComplaintStatus.PENDING
                ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground"
            )}
          >
            <UserX className="size-3" />
            Unassigned Only
          </button>

          {/* Escalated Quick Toggle */}
          <button
            type="button"
            onClick={() =>
              setParams({
                escalated: escalated ? null : "true",
                page: null,
              })
            }
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border",
              escalated
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground"
            )}
          >
            <AlertCircle className="size-3" />
            Escalated Only
          </button>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
          >
            <RotateCcw className="size-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
