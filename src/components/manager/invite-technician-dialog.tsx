"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Mail, Phone, User as UserIcon, UserPlus } from "lucide-react";
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
  managerInviteTechnicianSchema,
  type ManagerInviteTechnicianFormData,
} from "@/schemas/staff-invite.schema";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";

interface InviteTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentName: string;
  departmentId?: string;
}

export function InviteTechnicianDialog({
  open,
  onOpenChange,
  departmentName,
  departmentId,
}: InviteTechnicianDialogProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManagerInviteTechnicianFormData>({
    resolver: zodResolver(managerInviteTechnicianSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
    mode: "onTouched",
  });

  const inviteMutation = useMutation({
    mutationFn: (data: ManagerInviteTechnicianFormData) =>
      departmentService.inviteTechnician({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || undefined,
      }),
    onSuccess: (_, variables) => {
      toast.success(`Invitation sent to ${variables.email}`);
      // Invalidate the team list, admin users, dashboard stats and public technician data
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.myTechnicians(),
      });
      if (departmentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.departments.technicians(departmentId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
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

  const onSubmit = async (data: ManagerInviteTechnicianFormData) => {
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
            Add Department Technician
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {departmentName} — they&apos;ll receive a temporary password by
            email (valid 7 days) and must set their own password at first
            sign-in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="tech-name" className="text-xs font-semibold">
              Full name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                id="tech-name"
                placeholder="e.g. Marcus Vance"
                disabled={inviteMutation.isPending}
                className={`pl-9 ${
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : ""
                }`}
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
            <Label htmlFor="tech-email" className="text-xs font-semibold">
              Email address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                id="tech-email"
                type="email"
                placeholder="technician@cityfix.gov"
                disabled={inviteMutation.isPending}
                className={`pl-9 ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : ""
                }`}
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
            <Label htmlFor="tech-phone" className="text-xs font-semibold">
              Phone number <span className="text-muted-foreground text-[10px]">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                id="tech-phone"
                type="tel"
                placeholder="+1 (555) 234-5678"
                disabled={inviteMutation.isPending}
                className={`pl-9 ${
                  errors.phone
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : ""
                }`}
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
