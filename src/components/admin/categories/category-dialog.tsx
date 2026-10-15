"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, FolderTree, Loader2, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryFormSchema, type CategoryFormData } from "@/schemas/category-schema";
import { adminService } from "@/services/admin.service";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import type { Category } from "@/types/category";
import type { Department } from "@/types/department";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  defaultDepartmentId?: string;
}

const SLA_PRESETS = [
  { label: "24h (1 day)", value: 24 },
  { label: "48h (2 days)", value: 48 },
  { label: "72h (3 days)", value: 72 },
  { label: "120h (5 days)", value: 120 },
];

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  defaultDepartmentId = "",
}: CategoryDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(category);

  // Fetch departments for department selector
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: queryKeys.departments.all,
    queryFn: () => departmentService.getDepartments(),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      departmentId: defaultDepartmentId,
      slaHours: 72,
    },
  });

  const currentSla = watch("slaHours");
  const selectedDeptId = watch("departmentId");

  React.useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          description: category.description || "",
          departmentId: category.departmentId,
          slaHours: category.slaHours || 72,
        });
      } else {
        reset({
          name: "",
          description: "",
          departmentId: defaultDepartmentId || (departments[0]?.id || ""),
          slaHours: 72,
        });
      }
    }
  }, [open, category, defaultDepartmentId, departments, reset]);

  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        slaHours: Number(data.slaHours),
      };
      if (isEdit && category) {
        return adminService.updateCategory(category.id, payload);
      }
      return adminService.createCategory(data.departmentId, payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Category updated" : "Category created");
      onOpenChange(false);
      reset();
    },
    onError: (err) => {
      toast.error(getErrorMessage(err) || `Failed to ${isEdit ? "update" : "create"} category.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.public.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <FolderTree className="size-5 text-violet-500" />
            {isEdit ? "Edit Service Category" : "Create Service Category"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? `Configure category title, descriptive triage instructions, and SLA targets for "${category?.name}".`
              : "Register a civic classification to route incident reports and define municipal resolution timelines."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name" className="text-xs font-semibold text-foreground">
              Category Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cat-name"
              placeholder="e.g. Water Main Leakage & Pipe Burst"
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

          {/* Department Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-dept" className="text-xs font-semibold text-foreground">
              Assigned Department <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={selectedDeptId}
              onValueChange={(val) => val && setValue("departmentId", val, { shouldDirty: true })}
              disabled={isEdit || mutation.isPending || isSubmitting}
            >
              <SelectTrigger id="cat-dept" className="h-9 text-xs">
                <SelectValue placeholder="Select department..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="text-xs">
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* SLA Target Hours with Quick Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cat-sla" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-500" />
                SLA Resolution Target (Hours)
              </Label>
              <span className="text-[11px] font-mono text-muted-foreground">
                {currentSla ? `${Math.round(currentSla / 24)} day(s)` : ""}
              </span>
            </div>
            <Input
              id="cat-sla"
              type="number"
              min={1}
              max={720}
              placeholder="72"
              className="text-xs h-9"
              disabled={mutation.isPending || isSubmitting}
              {...register("slaHours", { valueAsNumber: true })}
            />
            {errors.slaHours && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.slaHours.message}
              </p>
            )}

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-muted-foreground font-semibold">Quick select:</span>
              {SLA_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setValue("slaHours", preset.value, { shouldDirty: true })}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    Number(currentSla) === preset.value
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-xs font-semibold text-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="cat-desc"
              rows={3}
              placeholder="Provide citizen guidance or triage guidelines for this issue type..."
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
                  {isEdit ? "Save Changes" : "Create Category"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
