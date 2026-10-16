"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  Loader2,
  Mail,
  Phone,
  User as UserIcon,
  UserPlus,
  Wrench,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminInviteStaffSchema,
  type AdminInviteStaffFormData,
} from "@/schemas/staff-invite.schema";
import { adminService } from "@/services/admin.service";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";

interface InviteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteStaffDialog({ open, onOpenChange }: InviteStaffDialogProps) {
  const queryClient = useQueryClient();

  // Fetch departments for the department dropdown
  const { data: departments = [], isLoading: isDeptsLoading } = useQuery({
    queryKey: queryKeys.departments.list(false),
    queryFn: () => departmentService.getDepartments(),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminInviteStaffFormData>({
    resolver: zodResolver(adminInviteStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "TECHNICIAN",
      departmentId: "",
    },
    mode: "onTouched",
  });

  const selectedRole = watch("role");

  const inviteMutation = useMutation({
    mutationFn: (data: AdminInviteStaffFormData) =>
      adminService.inviteStaff({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || undefined,
        role: data.role,
        departmentId: data.departmentId,
      }),
    onSuccess: (_, variables) => {
      toast.success(`Invitation sent to ${variables.email}`);
      // Invalidate users list, departments, dashboard stats and public data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.dashboardStats(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.public.all });

      reset();
      onOpenChange(false);
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      toast.error(message);
    },
  });

  const onSubmit = async (data: AdminInviteStaffFormData) => {
    inviteMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="size-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-1">
            <UserPlus className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Add Municipal Staff
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Invite a new Technician or Department Manager. They will receive a
            temporary password by email (valid 7 days) and must set their own
            password at first sign-in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Role Segmented Buttons */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Staff Role <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border/70">
              <button
                type="button"
                onClick={() => setValue("role", "TECHNICIAN", { shouldValidate: true })}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200",
                  selectedRole === "TECHNICIAN"
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Wrench className="size-3.5 text-violet-500" />
                <span>Technician</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("role", "MANAGER", { shouldValidate: true })}
                className={cn(
                  "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200",
                  selectedRole === "MANAGER"
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Briefcase className="size-3.5 text-blue-500" />
                <span>Manager</span>
              </button>
            </div>
          </div>

          {/* Department Select */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-dept" className="text-xs font-semibold">
              Assigned Department <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={inviteMutation.isPending || isDeptsLoading}
                >
                  <SelectTrigger
                    id="staff-dept"
                    className={cn(
                      "text-xs",
                      errors.departmentId && "border-destructive focus:ring-destructive/20"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="size-4 text-muted-foreground/70 shrink-0" />
                      <SelectValue placeholder="Select a department..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="text-xs">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.departmentId && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-name" className="text-xs font-semibold">
              Full name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                id="staff-name"
                placeholder="e.g. Sarah Jenkins"
                disabled={inviteMutation.isPending}
                className={cn(
                  "pl-9 text-xs",
                  errors.name && "border-destructive focus-visible:ring-destructive/20"
                )}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-email" className="text-xs font-semibold">
              Email address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                id="staff-email"
                type="email"
                placeholder="staff@cityfix.gov"
                disabled={inviteMutation.isPending}
                className={cn(
                  "pl-9 text-xs",
                  errors.email && "border-destructive focus-visible:ring-destructive/20"
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-phone" className="text-xs font-semibold">
              Phone number <span className="text-muted-foreground text-[10px]">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                id="staff-phone"
                type="tel"
                placeholder="+1 (555) 456-7890"
                disabled={inviteMutation.isPending}
                className={cn(
                  "pl-9 text-xs",
                  errors.phone && "border-destructive focus-visible:ring-destructive/20"
                )}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={inviteMutation.isPending}
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="neon"
              size="sm"
              disabled={inviteMutation.isPending}
              className="text-xs"
            >
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Sending invite…
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5 mr-1.5" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
