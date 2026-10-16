"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import {
  setPasswordSchema,
  type SetPasswordFormData,
} from "@/schemas/auth.schema";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { queryKeys } from "@/lib/query-keys";
import { setTokens, clearTokens } from "@/lib/auth-cookies";
import { ROLE_HOME } from "@/lib/roles";
import { getErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";

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

export function SetPasswordForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout, isLoading } = useAuth();

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // If user does not require password change, redirect to their role home
  React.useEffect(() => {
    if (!isLoading && user && !user.mustChangePassword) {
      router.replace(ROLE_HOME[user.role] || "/dashboard");
    }
  }, [user, isLoading, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const watchedNewPass = watch("newPassword", "");
  const strength = calculatePasswordStrength(watchedNewPass);

  const onSubmit = async (data: SetPasswordFormData) => {
    if (!user?.email) {
      toast.error("User session missing. Please sign in again.");
      router.replace("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit password change to backend (POST/PATCH /users/me/password)
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // 2. The backend revokes refresh tokens on success, so immediately call normal login to get fresh tokens
      try {
        const loginRes = await authService.login({
          email: user.email,
          password: data.newPassword,
        });

        setTokens({
          accessToken: loginRes.accessToken,
          role: loginRes.user.role,
          expiresInDays: 7,
        });
        useAuthStore.getState().setUser(loginRes.user);
        queryClient.setQueryData(queryKeys.auth.me(), loginRes.user);

        toast.success("Password set — welcome to CityFix!");
        router.replace(ROLE_HOME[loginRes.user.role] || "/dashboard");
      } catch {
        // If auto-login fails, clear session and send to login
        clearTokens();
        logout().catch(() => {});
        toast.info("Password set. Please sign in.");
        router.replace("/login");
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 mb-1">
          <Lock className="size-5" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Set your new password
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your account was created with a temporary password. Choose your own
          password to continue.
        </p>
      </div>

      {/* 2. Form Card */}
      <Card className="border border-border/80 shadow-md backdrop-blur-sm bg-card/95">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Temporary (Current) Password */}
            <div className="space-y-1.5">
              <Label htmlFor="temp-password" className="text-xs font-semibold">
                Temporary password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="temp-password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter the password from your invitation email"
                  disabled={isSubmitting}
                  className={`pr-10 text-xs ${
                    errors.currentPassword
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs font-semibold">
                New password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="At least 8 chars, 1 uppercase, 1 lowercase, 1 number"
                  disabled={isSubmitting}
                  className={`pr-10 text-xs ${
                    errors.newPassword
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {watchedNewPass && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Strength:</span>
                    <span className="font-semibold text-foreground">
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        strength.color
                      )}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-semibold">
                Confirm new password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  disabled={isSubmitting}
                  className={`pr-10 text-xs ${
                    errors.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : ""
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="neon"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-3 text-xs font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Setting password…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4 mr-2" />
                  Set Password & Continue
                </>
              )}
            </Button>
          </form>

          {/* Red Sign Out link for users who want to leave */}
          <div className="mt-5 pt-4 border-t border-border/50 text-center">
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline transition-colors"
            >
              <LogOut className="size-3.5" />
              <span>Sign out of this session</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
