"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Clock,
  FolderTree,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import type { Category } from "@/types/category";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  departmentsMap: Map<string, string>;
  onEdit: (category: Category) => void;
  emptyState?: React.ReactNode;
}

export function CategoriesTable({
  categories,
  isLoading,
  departmentsMap,
  onEdit,
  emptyState,
}: CategoriesTableProps) {
  const queryClient = useQueryClient();
  const [targetCategory, setTargetCategory] = React.useState<Category | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      setTargetCategory(null);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to delete category.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.public.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  const columns: ColumnDef<Category>[] = React.useMemo(
    () => [
      {
        key: "name",
        header: "Category & Description",
        cell: (item) => (
          <div className="space-y-0.5 min-w-0 max-w-sm">
            <span className="font-bold text-xs text-foreground block truncate">
              {item.name}
            </span>
            {item.description ? (
              <span className="text-[11px] text-muted-foreground block line-clamp-1">
                {item.description}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/60 italic block">
                No description provided
              </span>
            )}
          </div>
        ),
      },
      {
        key: "department",
        header: "Department",
        cell: (item) => {
          const deptName =
            item.department?.name ||
            (item.departmentId && departmentsMap.get(item.departmentId)) ||
            "Municipal Service";

          return (
            <Badge
              variant="outline"
              className="text-xs font-semibold border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 gap-1.5"
            >
              <Building2 className="size-3" />
              {deptName}
            </Badge>
          );
        },
      },
      {
        key: "slaHours",
        header: "SLA Timeline",
        cell: (item) => {
          const hours = item.slaHours || 72;
          const days = Math.round(hours / 24);
          return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-amber-500 shrink-0" />
              <span className="font-mono font-semibold text-foreground">{hours}h</span>
              <span className="text-[11px]">({days} {days === 1 ? "day" : "days"})</span>
            </div>
          );
        },
      },
      {
        key: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "text-right w-24",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label={`Edit ${item.name}`}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTargetCategory(item)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [departmentsMap, onEdit]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyState={emptyState}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(targetCategory)}
        onOpenChange={(open) => {
          if (!open) setTargetCategory(null);
        }}
        title={`Delete Category "${targetCategory?.name}"?`}
        description="This category will be marked as inactive and removed from citizen submission forms. The platform blocks deletion if any active unresolved complaints are currently filed under this category."
        confirmText="Delete Category"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (targetCategory) {
            await deleteMutation.mutateAsync(targetCategory.id);
          }
        }}
      />
    </>
  );
}
