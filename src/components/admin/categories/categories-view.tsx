"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  FilterX,
  FolderTree,
  Plus,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "./categories-table";
import { CategoryDialog } from "./category-dialog";
import { publicService } from "@/services/public.service";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import type { Category } from "@/types/category";
import type { Department } from "@/types/department";

const PAGE_LIMIT = 10;

export function CategoriesView() {
  const { getParam, getNumberParam, setParams } = useUrlState();

  const q = getParam("q", "");
  const departmentId = getParam("departmentId", "");
  const currentPage = getNumberParam("page", 1);

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  // 1. Fetch all categories
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch,
  } = useQuery<Category[]>({
    queryKey: queryKeys.categories.publicList(),
    queryFn: () => publicService.getCategories(),
  });

  // 2. Fetch departments for dropdown filter and labels
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: () => departmentService.getDepartments(),
  });

  const departmentsMap = React.useMemo(() => {
    const map = new Map<string, string>();
    departments.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [departments]);

  const departmentOptions = React.useMemo(() => {
    return departments.map((d) => ({ label: d.name, value: d.id }));
  }, [departments]);

  // Client-side filtering by `q` and `departmentId`
  const filteredCategories = React.useMemo(() => {
    return categories.filter((cat) => {
      if (departmentId && cat.departmentId !== departmentId) return false;
      if (q.trim()) {
        const query = q.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(query);
        const matchesDesc = cat.description ? cat.description.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [categories, departmentId, q]);

  // Client-side pagination
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / PAGE_LIMIT) || 1;
  const paginatedCategories = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_LIMIT;
    return filteredCategories.slice(start, start + PAGE_LIMIT);
  }, [filteredCategories, currentPage]);

  const hasActiveFilters = Boolean(q.trim() || departmentId);

  const handleClearFilters = () => {
    setParams({
      q: undefined,
      departmentId: undefined,
      page: 1,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header with New Category Neon Button */}
      <PageHeader
        title="Service Categories"
        description="Define and maintain civic incident classifications, associate problem domains with municipal departments, and adjust SLA resolution time targets."
        actions={
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/25 gap-1.5"
          >
            <Plus className="size-4" />
            New Category
          </Button>
        }
      />

      {/* 2. Search & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px] max-w-xl">
          <div className="flex-1 min-w-[200px]">
            <SearchInput
              defaultValue={q}
              placeholder="Search categories by name or description..."
              className="h-9 text-xs"
            />
          </div>

          <FilterSelect
            paramKey="departmentId"
            options={departmentOptions}
            placeholder="Filter by department"
            allLabel="All Departments"
            className="w-56 text-xs"
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
      {isCategoriesError ? (
        <div className="py-20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load service categories
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
          <CategoriesTable
            categories={paginatedCategories}
            isLoading={isCategoriesLoading}
            departmentsMap={departmentsMap}
            onEdit={(cat) => setEditingCategory(cat)}
            emptyState={
              <EmptyState
                icon={FolderTree}
                title={hasActiveFilters ? "No categories match your filters" : "No service categories registered"}
                description={
                  hasActiveFilters
                    ? "Try adjusting your department filter or searching with a different term."
                    : "Add the first service category to enable citizens to file complaints under that department."
                }
                action={
                  hasActiveFilters
                    ? {
                        label: "Clear filters",
                        onClick: handleClearFilters,
                      }
                    : {
                        label: "Create Category",
                        onClick: () => setCreateDialogOpen(true),
                      }
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
                total: totalItems,
                limit: PAGE_LIMIT,
              }}
            />
          )}
        </div>
      )}

      {/* Create Dialog */}
      <CategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultDepartmentId={departmentId}
      />

      {/* Edit Dialog */}
      <CategoryDialog
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
        category={editingCategory}
      />
    </div>
  );
}
