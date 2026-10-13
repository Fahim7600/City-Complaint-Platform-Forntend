"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  changePasswordFormSchema,
  type ChangePasswordFormData,
} from "@/schemas/profile-schemas";
import { userService } from "@/services/user.service";
import { getErrorMessage } from "@/lib/axios";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface SecurityFormProps {
  user: User;
}

function calculatePasswordStrength(pass: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pass) return { score: 0, label: "None", color: "bg-muted" };

  let score = 0;
  if (pass.length >= 8) score += 25;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
  if (/\d/.test(pass)) score += 25;
  if (/[^A-Za-z0-9]/.test(pass)) score += 25;

  if (score <= 25) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 75) return { score, label: "Medium", color: "bg-amber-500" };
  return { score: 100, label: "Strong", color: "bg-emerald-500" };
}

export function SecurityForm({ user }: SecurityFormProps) {
  const isGoogleUser = Boolean(user.googleId);
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedNewPass = watch("newPassword", "");
  const strength = calculatePasswordStrength(watchedNewPass);

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully");
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth account
  if (isGoogleUser) {
    return (
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                Google Authentication Active
              </h3>
              <p className="text-xs text-muted-foreground">
                Your account is secured via Google Single Sign-On ({user.email}).
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
            <p>
              Because your profile was created through Google OAuth, your login credentials and two-factor authentication are managed directly within your Google Account settings.
            </p>
            <p>
              No separate local password is required to access CityFix.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1 pb-2 border-b border-border/50">
          <h3 className="font-heading text-base font-semibold text-foreground">
            Change Password
          </h3>
          <p className="text-xs text-muted-foreground">
            Update your account password. Changing your password revokes all existing active sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <Label htmlFor="current-pass" className="text-xs font-semibold">
              Current Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="current-pass"
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Enter your current password"
                className={cn(
                  "pl-9 pr-9 h-9 text-xs bg-background/80 border-border/70",
                  errors.currentPassword && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-pass" className="text-xs font-semibold">
              New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="new-pass"
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
                placeholder="At least 8 characters"
                className={cn(
                  "pl-9 pr-9 h-9 text-xs bg-background/80 border-border/70",
                  errors.newPassword && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.newPassword.message}
              </p>
            )}

            {/* Live Strength Bar */}
            {watchedNewPass.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">Strength:</span>
                  <span className="font-semibold text-foreground">
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      strength.color
                    )}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-pass" className="text-xs font-semibold">
              Confirm New Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirm-pass"
                type="password"
                {...register("confirmPassword")}
                placeholder="Re-enter your new password"
                className={cn(
                  "pl-9 h-9 text-xs bg-background/80 border-border/70",
                  errors.confirmPassword && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
