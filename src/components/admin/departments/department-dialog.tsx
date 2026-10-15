"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { departmentFormSchema, type DepartmentFormData } from "@/schemas/department-schema";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import type { Department } from "@/types/department";

interface DepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
}

export function DepartmentDialog({
  open,
  onOpenChange,
  department,
}: DepartmentDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(department);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (department) {
        reset({
          name: department.name,
          description: department.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }
  }, [open, department, reset]);

  const mutation = useMutation({
    mutationFn: (data: DepartmentFormData) => {
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      };
      if (isEdit && department) {
        return adminService.updateDepartment(department.id, payload);
      }
      return adminService.createDepartment(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Department updated" : "Department created");
      onOpenChange(false);
      reset();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || `Failed to ${isEdit ? "update" : "create"} department.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.public.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  const onSubmit = (data: DepartmentFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <Building2 className="size-5 text-violet-500" />
            {isEdit ? "Edit Municipal Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? `Modify operational details for "${department?.name}". Changes immediately update public and internal systems.`
              : "Establish a new city service division for ticket assignment, technician rosters, and citizen categories."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Department Name */}
          <div className="space-y-1.5">
            <Label htmlFor="dept-name" className="text-xs font-semibold text-foreground">
              Department Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="dept-name"
              placeholder="e.g. Roads & Transport Infrastructure"
              className="text-xs h-9"
              disabled={mutation.isPending || isSubmitting}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Department Description */}
          <div className="space-y-1.5">
            <Label htmlFor="dept-desc" className="text-xs font-semibold text-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="dept-desc"
              rows={3}
              placeholder="Operational responsibilities and service scope for this department..."
              className="text-xs resize-none"
              disabled={mutation.isPending || isSubmitting}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending || isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={(isEdit && !isDirty) || mutation.isPending || isSubmitting}
              className="text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/25"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  {isEdit ? "Save Changes" : "Create Department"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
