"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, ShieldCheck, UserCog } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService, type OverrideUserRoleInput } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { Role, type User } from "@/types/user";
import type { PaginatedData } from "@/types/api";

const changeRoleSchema = z
  .object({
    role: z.enum(["CITIZEN", "TECHNICIAN", "MANAGER"]),
    departmentId: z.string().optional(),
  })
  .refine(
    (data) => {
      if ((data.role === "TECHNICIAN" || data.role === "MANAGER") && !data.departmentId) {
        return false;
      }
      return true;
    },
    {
      message: "A department must be assigned for Technician or Manager roles",
      path: ["departmentId"],
    }
  );

type ChangeRoleFormData = z.infer<typeof changeRoleSchema>;

interface ChangeRoleDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
}: ChangeRoleDialogProps) {
  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departments = [], isLoading: isDeptLoading } = useQuery({
    queryKey: queryKeys.departments.list(),
    queryFn: () => adminService.getDepartments(),
    enabled: open,
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangeRoleFormData>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: (user?.role === "ADMIN" ? "CITIZEN" : user?.role || "CITIZEN") as "CITIZEN" | "TECHNICIAN" | "MANAGER",
      departmentId: user?.departmentId || undefined,
    },
  });

  React.useEffect(() => {
    if (user && open) {
      reset({
        role: (user.role === "ADMIN" ? "CITIZEN" : user.role) as "CITIZEN" | "TECHNICIAN" | "MANAGER",
        departmentId: user.departmentId || undefined,
      });
    }
  }, [user, open, reset]);

  const selectedRole = watch("role");
  const selectedDeptId = watch("departmentId");
  const isStaffRole = selectedRole === "TECHNICIAN" || selectedRole === "MANAGER";

  // Role override mutation with optimistic update and rollback
  const roleMutation = useMutation({
    mutationFn: (data: ChangeRoleFormData) => {
      if (!user) throw new Error("No user selected");
      const payload: OverrideUserRoleInput = {
        role: data.role,
        departmentId: isStaffRole ? data.departmentId : undefined,
      };
      return adminService.overrideUserRole(user.id, payload);
    },
    onMutate: async (data) => {
      if (!user) return;
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      // Snapshot previous list queries
      const previousLists = queryClient.getQueriesData<PaginatedData<User>>({
        queryKey: queryKeys.users.all,
      });

      const matchedDept = departments.find((d) => d.id === data.departmentId);

      // Optimistically update users in cache
      queryClient.setQueriesData<PaginatedData<User>>(
        { queryKey: queryKeys.users.all },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((u) =>
              u.id === user.id
                ? {
                    ...u,
                    role: data.role as Role,
                    departmentId: isStaffRole ? data.departmentId || null : null,
                    department: isStaffRole && matchedDept ? matchedDept : null,
                  }
                : u
            ),
          };
        }
      );

      return { previousLists };
    },
    onError: (err, _variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([key, val]) => {
          queryClient.setQueryData(key, val);
        });
      }
      toast.error(getErrorMessage(err) || "Failed to update user role.");
    },
    onSuccess: (updatedUser, variables) => {
      toast.success(
        `${user?.name || "User"} is now a ${variables.role.toLowerCase()}`
      );
      onOpenChange(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });

  const onSubmit = (data: ChangeRoleFormData) => {
    roleMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <UserCog className="size-5 text-violet-500" />
            Override User Role
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Assign a new platform role and department for{" "}
            <span className="font-semibold text-foreground">{user.name}</span> (
            {user.email}).
          </DialogDescription>
        </DialogHeader>

        {/* Informational Warning Alert */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold">Notice:</span> The user must sign in again
            to receive a refreshed token and access their new portal dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Role Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Platform Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(val) =>
                setValue("role", val as "CITIZEN" | "TECHNICIAN" | "MANAGER", {
                  shouldValidate: true,
                })
              }
              disabled={roleMutation.isPending}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITIZEN" className="text-xs">
                  Citizen (Standard user)
                </SelectItem>
                <SelectItem value="TECHNICIAN" className="text-xs">
                  Technician (Field service worker)
                </SelectItem>
                <SelectItem value="MANAGER" className="text-xs">
                  Manager (Department supervisor)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Department Select (Required for Technician/Manager) */}
          {isStaffRole && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>
                  Assigned Department <span className="text-destructive">*</span>
                </span>
                {isDeptLoading && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Loader2 className="size-3 animate-spin" /> Loading...
                  </span>
                )}
              </Label>
              <Select
                value={selectedDeptId || ""}
                onValueChange={(val) =>
                  setValue("departmentId", val || undefined, { shouldValidate: true })
                }
                disabled={roleMutation.isPending || isDeptLoading}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select municipal department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem
                      key={dept.id}
                      value={dept.id}
                      className="text-xs"
                    >
                      {dept.name}
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
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={roleMutation.isPending}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={roleMutation.isPending}
              className="text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20"
            >
              {roleMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5 mr-1.5" />
                  Confirm Role Change
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
