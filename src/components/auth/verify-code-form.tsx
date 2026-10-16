"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Inbox,
  KeyRound,
  Loader2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/shared/otp-input";
import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/axios";

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = React.useState(false);

  // Cooldown countdown state
  const [countdown, setCountdown] = React.useState(60);

  // Redirect if no email query param
  React.useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  // Countdown timer effect
  React.useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleVerify = React.useCallback(
    async (codeToVerify: string) => {
      if (codeToVerify.length !== 6 || isVerifying || isLockedOut) return;

      setIsVerifying(true);
      setErrorMessage(null);

      try {
        const res = await authService.verifyResetCode(email, codeToVerify);

        // Store resetToken and expiry in sessionStorage (NEVER in URL)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("cityfix_reset_token", res.resetToken);
          sessionStorage.setItem(
            "cityfix_reset_token_expires",
            String(Date.now() + (res.expiresInSeconds || 900) * 1000)
          );
          sessionStorage.setItem("cityfix_reset_email", email);
        }

        toast.success("Code verified successfully");
        router.push("/reset-password");
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        setErrorMessage(msg);

        if (msg.toLowerCase().includes("too many attempts")) {
          setIsLockedOut(true);
        } else {
          // Clear boxes on invalid code to trigger shake
          setCode("");
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [email, isVerifying, isLockedOut, router]
  );

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);
    setIsLockedOut(false);
    setCode("");

    try {
      const res = await authService.forgotPassword(email);
      const cooldownSec = res.cooldownSeconds || 60;
      setCountdown(cooldownSec);
      toast.success("New code sent");
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* 1. Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 mb-1">
          <KeyRound className="size-5" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Enter the 6-digit code
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We sent a temporary verification code to{" "}
          <span className="font-semibold text-foreground">
            {maskEmail(email)}
          </span>
          .{" "}
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Change email
          </Link>
        </p>
      </div>

      {/* 2. Primary Card */}
      <Card className="border border-border/80 shadow-md backdrop-blur-sm bg-card/95">
        <CardContent className="p-6 space-y-6">
          {/* OTP Boxes */}
          <div className="space-y-3">
            <OtpInput
              value={code}
              onChange={(newVal) => {
                setCode(newVal);
                if (errorMessage) setErrorMessage(null);
              }}
              onComplete={(completedCode) => handleVerify(completedCode)}
              disabled={isVerifying || isLockedOut}
              hasError={Boolean(errorMessage)}
              autoFocus
            />

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-destructive font-medium pt-1 text-center">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Locked Out State vs Normal Resend */}
          {isLockedOut ? (
            <div className="space-y-3 pt-2 text-center">
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-center gap-2">
                <ShieldAlert className="size-4 shrink-0" />
                <span>Verification locked due to too many attempts.</span>
              </div>
              <Button
                type="button"
                variant="neon"
                size="lg"
                disabled={isResending}
                onClick={handleResend}
                className="w-full text-xs font-semibold"
              >
                {isResending ? (
                  <>
                    <Loader2 className="size-3.5 mr-2 animate-spin" />
                    Sending new code…
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-3.5 mr-2" />
                    Send a new code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-muted-foreground">
                Didn&apos;t receive the code?
              </span>

              {countdown > 0 ? (
                <span className="font-mono text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Resend in {formatCountdown(countdown)}
                </span>
              ) : (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResend}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-500 hover:underline transition-colors flex items-center gap-1"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <span>Resend code</span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Brevo Spam folder warning */}
          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 text-xs text-muted-foreground flex items-start gap-2.5">
            <Inbox className="size-4 text-teal-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Check your Spam or Junk folder if the email doesn&apos;t arrive
              within a minute. Municipal notifications are sent via Brevo.
            </p>
          </div>

          {/* Back link */}
          <div className="pt-3 border-t border-border/50 text-center">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to email request</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
