"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Loader2, Mail, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/axios";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      toast.success(
        `If an account exists, a 6-digit code was sent to ${data.email}`
      );
      router.push(`/forgot-password/verify?email=${encodeURIComponent(data.email)}`);
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
          <KeyRound className="size-5" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter your registered email address. We&apos;ll send you a 6-digit verification code to reset your password.
        </p>
      </div>

      {/* 2. Form Card */}
      <Card className="border border-border/80 shadow-md backdrop-blur-sm bg-card/95">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email" className="text-xs font-semibold">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={`pl-9 text-xs ${
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
                  Sending code…
                </>
              ) : (
                <>
                  <Mail className="size-4 mr-2" />
                  Send Code
                </>
              )}
            </Button>
          </form>

          {/* Google Sign-in note */}
          <div className="mt-5 p-3 rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground flex items-start gap-2.5">
            <Sparkles className="size-4 text-teal-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Signed up with Google? Just use{" "}
              <Link
                href="/login"
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                Continue with Google
              </Link>
              , no password needed.
            </p>
          </div>

          {/* Back to login */}
          <div className="mt-5 pt-4 border-t border-border/50 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Remember your password? Sign in</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
