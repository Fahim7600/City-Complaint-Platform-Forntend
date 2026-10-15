"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Crown,
  FileText,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { formatDate } from "@/lib/format-date";
import type { SubscriptionResponse } from "@/types/payment";
import { cn } from "@/lib/utils";

// Generate static positions for CSS-only confetti burst
const CONFETTI_PIECES = Array.from({ length: 36 }).map((_, i) => {
  const angle = (i / 36) * 360;
  const distance = 80 + (i % 5) * 25;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * distance;
  const y = Math.sin(rad) * distance;
  const colors = [
    "#a855f7", // violet
    "#14b8a6", // teal
    "#f59e0b", // amber
    "#3b82f6", // blue
    "#10b981", // emerald
    "#ec4899", // pink
  ];
  return {
    id: i,
    x,
    y,
    color: colors[i % colors.length],
    size: 6 + (i % 3) * 3,
    delay: (i % 6) * 0.05,
    rotation: (i * 35) % 360,
  };
});

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();

  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    sessionId ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    sessionId ? null : "Missing checkout session identifier."
  );
  const [subscriptionData, setSubscriptionData] =
    React.useState<SubscriptionResponse | null>(null);

  // Strict mode execution guard
  const hasCalledConfirm = React.useRef(false);

  const performConfirm = React.useCallback(
    async (id: string) => {
      setStatus("loading");
      setErrorMessage(null);

      try {
        await paymentService.confirmSession({ sessionId: id });

        // Invalidate queries so subscription & auth states refresh everywhere
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.payments.subscription(),
          }),
          queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
          queryClient.invalidateQueries({ queryKey: queryKeys.public.all }),
          queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all }),
        ]);

        // Fetch fresh subscription details for the summary card
        try {
          const freshSub = await paymentService.getMySubscription();
          setSubscriptionData(freshSub);
        } catch {
          // Non-fatal if fetch fails
        }

        setStatus("success");
        toast.success("Payment successful — you're Premium now!");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          getErrorMessage(err) ||
            "Unable to verify transaction with Stripe. Your subscription will sync automatically via webhook if charged."
        );
      }
    },
    [queryClient]
  );

  React.useEffect(() => {
    if (!sessionId) {
      return;
    }

    if (!hasCalledConfirm.current) {
      hasCalledConfirm.current = true;
      performConfirm(sessionId);
    }
  }, [sessionId, performConfirm]);

  const renewalDate = subscriptionData?.subscription?.currentPeriodEnd
    ? formatDate(subscriptionData.subscription.currentPeriodEnd)
    : "in 1 month";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Graphic elements matching public theme */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#03604c]/30 via-background to-[#7c3aed]/20 pointer-events-none" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-80 opacity-[0.06] dark:opacity-[0.1] select-none">
        <Image
          src="/stacked-steps-haikei.svg"
          alt=""
          fill
          className="object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* STATE: LOADING */}
        {status === "loading" && (
          <Card className="border border-violet-500/30 bg-card/80 backdrop-blur-xl shadow-2xl text-center p-8 sm:p-10 space-y-6">
            <div className="relative flex size-20 mx-auto items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
              <div className="size-16 rounded-full border-4 border-t-violet-500 border-r-violet-500/30 border-b-violet-500/10 border-l-violet-500/60 animate-spin shadow-[0_0_25px_rgba(168,85,247,0.4)]" />
              <Crown className="size-6 text-violet-500 absolute" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Confirming your payment…
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Synchronizing your Stripe checkout session and activating your Premium citizen privileges.
              </p>
            </div>
          </Card>
        )}

        {/* STATE: SUCCESS */}
        {status === "success" && (
          <div className="relative">
            {/* CSS-Only Confetti Burst */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible motion-reduce:hidden"
            >
              {CONFETTI_PIECES.map((piece) => (
                <span
                  key={piece.id}
                  className="absolute rounded-sm animate-confetti opacity-0"
                  style={
                    {
                      backgroundColor: piece.color,
                      width: `${piece.size}px`,
                      height: `${piece.size * 0.6}px`,
                      "--tx": `${piece.x}px`,
                      "--ty": `${piece.y}px`,
                      "--rot": `${piece.rotation}deg`,
                      animationDelay: `${piece.delay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            <Card className="relative overflow-hidden border border-emerald-500/40 bg-card/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-3">
                {/* Big Green Check with smooth scale-in */}
                <div className="flex size-18 mx-auto items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.45)] animate-in zoom-in-75 duration-500">
                  <Check className="size-9 stroke-[3]" />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)] mb-1">
                    <Crown className="size-3.5 fill-amber-500" />
                    Verified Citizen PRO
                  </div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Welcome to Premium!
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    Your Stripe payment was confirmed. Your account is now upgraded with full priority civic privileges.
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Membership Plan</span>
                  <span className="font-bold text-foreground">Premium Citizen</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Next Renewal Date</span>
                  <span className="font-bold text-foreground">{renewalDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Monthly Filings</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    20 Complaints / Month
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link href="/dashboard" className="w-full">
                  <Button
                    className={cn(
                      "w-full text-xs font-bold text-white shadow-lg",
                      "bg-gradient-to-r from-teal-500 via-primary to-violet-600 hover:opacity-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    )}
                  >
                    Go to Dashboard
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                </Link>

                <Link href="/dashboard/subscription" className="w-full">
                  <Button variant="outline" className="w-full text-xs font-semibold">
                    <FileText className="size-3.5 mr-1.5" />
                    View Subscription
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* STATE: ERROR / MISSING SESSION */}
        {status === "error" && (
          <Card className="border border-rose-500/40 bg-card/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6 text-center">
            <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
              <AlertTriangle className="size-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-heading text-xl font-bold text-foreground">
                We couldn&apos;t confirm your payment yet
              </h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {errorMessage ||
                  "If your card was charged, Stripe webhooks will automatically activate your Premium subscription shortly."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {sessionId ? (
                <Button
                  onClick={() => performConfirm(sessionId)}
                  className="w-full text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/20"
                >
                  <RefreshCw className="size-3.5 mr-1.5" />
                  Try Again
                </Button>
              ) : null}

              <Link href="/dashboard/subscription" className={cn("w-full", !sessionId && "sm:col-span-2")}>
                <Button variant="outline" className="w-full text-xs font-semibold">
                  Go to Subscription
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
