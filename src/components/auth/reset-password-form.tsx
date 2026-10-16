"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
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

export function ResetPasswordForm() {
  const router = useRouter();

  const [resetToken, setResetToken] = React.useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = React.useState<number>(900);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Read resetToken and expiry from sessionStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const token = sessionStorage.getItem("cityfix_reset_token");
    const expiresStr = sessionStorage.getItem("cityfix_reset_token_expires");

    if (!token || !expiresStr) {
      toast.info("Please request a new code");
      router.replace("/forgot-password");
      return;
    }

    const expiresAt = Number(expiresStr);
    const now = Date.now();
    const diffSeconds = Math.floor((expiresAt - now) / 1000);

    if (diffSeconds <= 0) {
      sessionStorage.removeItem("cityfix_reset_token");
      sessionStorage.removeItem("cityfix_reset_token_expires");
      sessionStorage.removeItem("cityfix_reset_email");
      toast.info("Please request a new code");
      router.replace("/forgot-password");
      return;
    }

    setResetToken(token);
    setRemainingSeconds(diffSeconds);
  }, [router]);

  // Expiry countdown timer
  React.useEffect(() => {
    if (remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          sessionStorage.removeItem("cityfix_reset_token");
          sessionStorage.removeItem("cityfix_reset_token_expires");
          sessionStorage.removeItem("cityfix_reset_email");
          toast.error("Reset token expired. Please request a new code.");
          router.replace("/forgot-password");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingSeconds, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      resetToken: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Keep resetToken in form state
  React.useEffect(() => {
    if (resetToken) {
      setValue("resetToken", resetToken);
    }
  }, [resetToken, setValue]);

  const watchedNewPass = watch("newPassword", "");
  const strength = calculatePasswordStrength(watchedNewPass);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!resetToken) {
      toast.info("Please request a new code");
      router.replace("/forgot-password");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(resetToken, data.newPassword);

      // Clear sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("cityfix_reset_token");
        sessionStorage.removeItem("cityfix_reset_token_expires");
        sessionStorage.removeItem("cityfix_reset_email");
      }

      toast.success("Password updated — please sign in");
      router.push("/login");
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes("reset link expired")) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("cityfix_reset_token");
          sessionStorage.removeItem("cityfix_reset_token_expires");
          sessionStorage.removeItem("cityfix_reset_email");
        }
        toast.error(msg);
        router.push("/forgot-password");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!resetToken) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 mb-1">
          <Lock className="size-5" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Choose a new password
        </h1>
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
          <Clock className="size-3.5 text-amber-500 shrink-0" />
          <span>
            Reset token expires in{" "}
            <span className="font-mono font-bold text-foreground">
              {formatCountdown(remainingSeconds)}
            </span>
          </span>
        </div>
      </div>

      {/* 2. Primary Form Card */}
      <Card className="border border-border/80 shadow-md backdrop-blur-sm bg-card/95">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reset-new-password" className="text-xs font-semibold">
                New password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="reset-new-password"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reset-confirm-password" className="text-xs font-semibold">
                Confirm new password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="reset-confirm-password"
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

            <Button
              type="submit"
              variant="neon"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2 text-xs font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Updating password…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-5 pt-4 border-t border-border/50 text-center">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Request a different code</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
