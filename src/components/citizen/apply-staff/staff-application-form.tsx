"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Loader2,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  staffApplicationFormSchema,
  type StaffApplicationFormData,
} from "@/schemas/staff-application-schema";
import { publicService } from "@/services/public.service";
import { userService } from "@/services/user.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth-store";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";

interface StaffApplicationFormProps {
  onSuccess?: () => void;
}

export function StaffApplicationForm({ onSuccess }: StaffApplicationFormProps) {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch departments
  const { data: departments = [], isLoading: isDeptsLoading } = useQuery({
    queryKey: queryKeys.departments.list(),
    queryFn: () => publicService.getDepartments(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffApplicationFormData>({
    resolver: zodResolver(staffApplicationFormSchema),
    defaultValues: {
      requestedRole: "TECHNICIAN",
      departmentId: "",
      experience: "",
      qualification: "",
    },
  });

  const requestedRole = watch("requestedRole");
  const selectedDeptId = watch("departmentId");
  const experienceVal = watch("experience", "") || "";
  const qualificationVal = watch("qualification", "") || "";

  const isManager = requestedRole === "MANAGER";

  const onSubmit = async (data: StaffApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Backend rule: Technician applications must NOT include experience or qualification
      const payload = {
        requestedRole: data.requestedRole,
        departmentId: data.departmentId,
        experience: isManager ? data.experience?.trim() : undefined,
        qualification: isManager ? data.qualification?.trim() : undefined,
      };

      const updatedUser = await userService.submitStaffApplication(payload);
      setUser(updatedUser);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]);

      toast.success("Application submitted successfully");
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to submit staff application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6 sm:p-7 space-y-6">
        <div className="space-y-1 pb-2 border-b border-border/50">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Apply to Join CityFix Staff
          </h3>
          <p className="text-xs text-muted-foreground">
            Select your target municipal role and department to submit your credential application.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Choice */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Desired Staff Position <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Technician */}
              <button
                type="button"
                onClick={() => {
                  setValue("requestedRole", "TECHNICIAN", { shouldValidate: true });
                  setValue("experience", undefined);
                  setValue("qualification", undefined);
                }}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all duration-200 bg-card/60 flex items-start gap-3",
                  requestedRole === "TECHNICIAN"
                    ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30 shadow-sm"
                    : "border-border/70 hover:border-violet-500/40"
                )}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg border shrink-0",
                    requestedRole === "TECHNICIAN"
                      ? "bg-violet-500 text-white border-violet-600"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  <Wrench className="size-4" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-foreground">
                    Field Technician
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Resolve on-site maintenance tickets, update repair logs, and submit photo evidence.
                  </p>
                </div>
              </button>

              {/* Manager */}
              <button
                type="button"
                onClick={() =>
                  setValue("requestedRole", "MANAGER", { shouldValidate: true })
                }
                className={cn(
                  "p-4 rounded-xl border text-left transition-all duration-200 bg-card/60 flex items-start gap-3",
                  requestedRole === "MANAGER"
                    ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30 shadow-sm"
                    : "border-border/70 hover:border-violet-500/40"
                )}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg border shrink-0",
                    requestedRole === "MANAGER"
                      ? "bg-violet-500 text-white border-violet-600"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  <Briefcase className="size-4" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-foreground">
                    Department Manager
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Triage incoming department tickets, dispatch technicians, and manage SLA resolution queues.
                  </p>
                </div>
              </button>
            </div>
            {errors.requestedRole && (
              <p className="text-xs font-medium text-destructive">
                {errors.requestedRole.message}
              </p>
            )}
          </div>

          {/* Department Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="dept-select" className="text-xs font-semibold">
              Municipal Department <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedDeptId}
              onValueChange={(val) => {
                if (val) setValue("departmentId", val, { shouldValidate: true });
              }}
              disabled={isDeptsLoading}
            >
              <SelectTrigger
                id="dept-select"
                className={cn(
                  "h-9 text-xs bg-background/80 border-border/70",
                  errors.departmentId && "border-destructive focus:ring-destructive/30"
                )}
              >
                <SelectValue placeholder="Select target department..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id} className="text-xs">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.departmentId && (
              <p className="text-xs font-medium text-destructive">
                {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* Manager Specific Fields: Experience & Qualification */}
          {isManager && (
            <div className="space-y-4 pt-2 border-t border-border/50">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-600 dark:text-violet-300 flex items-center gap-2">
                <Sparkles className="size-4 shrink-0" />
                <span>
                  Manager candidates are evaluated based on prior civic management and supervisory background.
                </span>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-experience" className="text-xs font-semibold">
                    Supervisory Experience <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {experienceVal.length}/1000
                  </span>
                </div>
                <Textarea
                  id="app-experience"
                  {...register("experience")}
                  maxLength={1000}
                  rows={3}
                  placeholder="Detail your prior leadership, public works management, or administrative background..."
                  className={cn(
                    "text-xs bg-background/80 border-border/70",
                    errors.experience && "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {errors.experience && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Qualification */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-qualification" className="text-xs font-semibold">
                    Certifications & Qualifications <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {qualificationVal.length}/1000
                  </span>
                </div>
                <Textarea
                  id="app-qualification"
                  {...register("qualification")}
                  maxLength={1000}
                  rows={3}
                  placeholder="List relevant engineering degrees, civil certifications, or municipal credentials..."
                  className={cn(
                    "text-xs bg-background/80 border-border/70",
                    errors.qualification && "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {errors.qualification && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.qualification.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !selectedDeptId}
              className="text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="size-3.5 mr-1.5" />
                  Submit Application
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
