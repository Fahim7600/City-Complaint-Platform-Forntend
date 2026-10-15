"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  FolderTree,
  Loader2,
  Pencil,
  ShieldCheck,
  Trash2,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { getDepartmentIcon } from "./department-icon-helper";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import type { Department } from "@/types/department";

interface DepartmentCardProps {
  department: Department;
  categoryCount: number;
  technicianCount: number;
  openComplaintCount: number;
  managerName?: string | null;
  onSelect: (department: Department) => void;
  onEdit: (department: Department) => void;
}

export function DepartmentCard({
  department,
  categoryCount,
  technicianCount,
  openComplaintCount,
  managerName,
  onSelect,
  onEdit,
}: DepartmentCardProps) {
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const IconComponent = getDepartmentIcon(department.name);

  const deleteMutation = useMutation({
    mutationFn: () => adminService.deleteDepartment(department.id),
    onSuccess: () => {
      toast.success("Department deleted");
      setDeleteConfirmOpen(false);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || "Failed to delete department.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.public.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  return (
    <>
      <Card
        onClick={() => onSelect(department)}
        className="group relative cursor-pointer border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 flex flex-col justify-between"
      >
        <CardContent className="p-5 space-y-4">
          {/* Top Row: Icon + Name + Action Buttons */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <IconComponent className="size-5 text-violet-500 dark:text-violet-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-sm text-foreground truncate group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                  {department.name}
                </h3>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <User className="size-3 text-muted-foreground/70" />
                  {managerName ? (
                    <span className="font-medium text-foreground truncate">{managerName} (Lead)</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">No manager appointed</span>
                  )}
                </span>
              </div>
            </div>

            {/* Edit & Delete Action Buttons (stop event propagation) */}
            <div
              className="flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(department)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label={`Edit ${department.name}`}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                aria-label={`Delete ${department.name}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2rem]">
            {department.description || "Active municipal division handling civic service operations, dispatch, and triage."}
          </p>

          {/* Metric Badges Grid */}
          <div className="pt-2 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-background/60 border border-border/40 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <FolderTree className="size-2.5 text-violet-500" />
                Categories
              </span>
              <p className="font-mono font-bold text-xs text-foreground">
                {categoryCount}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-background/60 border border-border/40 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Users className="size-2.5 text-teal-500" />
                Technicians
              </span>
              <p className="font-mono font-bold text-xs text-foreground">
                {technicianCount}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-background/60 border border-border/40 space-y-0.5">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Wrench className="size-2.5 text-amber-500" />
                Open Tickets
              </span>
              <p
                className={
                  openComplaintCount > 0
                    ? "font-mono font-bold text-xs text-amber-600 dark:text-amber-400"
                    : "font-mono font-bold text-xs text-foreground"
                }
              >
                {openComplaintCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={`Delete Department "${department.name}"?`}
        description={
          openComplaintCount > 0
            ? `⚠️ Warning: This department currently has ${openComplaintCount} active open ticket(s). The platform blocks deletion while unresolved complaints remain. Please resolve or reassign them first.`
            : `This department will be marked as inactive and removed from public civic filing forms. All historical complaint records are preserved for municipal audit compliance.`
        }
        confirmText="Delete Department"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          await deleteMutation.mutateAsync();
        }}
      />
    </>
  );
}
