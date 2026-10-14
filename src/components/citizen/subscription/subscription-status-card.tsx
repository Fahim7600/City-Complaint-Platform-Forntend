"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Crown,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { paymentService } from "@/services/payment.service";
import { queryKeys } from "@/lib/query-keys";
import { formatDate } from "@/lib/format-date";
import { getErrorMessage } from "@/lib/axios";
import {
  SubscriptionStatus,
  type Subscription,
} from "@/types/payment";
import { BACKEND_ENFORCED_BENEFITS } from "./benefits-checklist";

interface SubscriptionStatusCardProps {
  subscription: Subscription | null;
  isPremium?: boolean;
}

export function SubscriptionStatusCard({
  subscription,
}: SubscriptionStatusCardProps) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  const status = subscription?.status || SubscriptionStatus.ACTIVE;
  const isPastDue = status === SubscriptionStatus.PAST_DUE;
  const isCancelScheduled = Boolean(subscription?.cancelAtPeriodEnd);

  const periodEndDate = subscription?.currentPeriodEnd
    ? formatDate(subscription.currentPeriodEnd)
    : "end of current cycle";

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const res = await paymentService.cancelSubscription();
      toast.success(
        res.message || `Subscription cancelled — active until ${periodEndDate}`
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.subscription(),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]);
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to schedule cancellation.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Status Card */}
      <Card className="relative overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-card/70 backdrop-blur-md shadow-lg">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 size-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <CardContent className="p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <Crown className="size-6 fill-amber-500" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Premium Citizen Status
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs"
                  >
                    Active Tier
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your municipal complaints receive priority triage and 20 monthly filings.
                </p>
              </div>
            </div>

            {/* Cancel Button (Hidden if already cancelled) */}
            {!isCancelScheduled && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                className="shrink-0 text-xs font-semibold shadow-sm self-start sm:self-auto"
              >
                <XCircle className="size-3.5 mr-1.5" />
                Cancel subscription
              </Button>
            )}
          </div>

          {/* Past Due Warning */}
          {isPastDue && (
            <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
              <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-500 animate-pulse" />
              <div className="space-y-0.5">
                <span className="font-bold">Payment failed — Stripe is retrying</span>
                <p className="text-[11px] leading-relaxed">
                  We were unable to process your latest renewal payment. Stripe will automatically retry over the coming days. Your premium privileges remain active in the interim.
                </p>
              </div>
            </div>
          )}

          {/* Billing Cycle Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-background/50 border border-border/60 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-foreground capitalize">
                  {status.toLowerCase().replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-background/50 border border-border/60 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Billing Cycle
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Calendar className="size-3.5 text-primary" />
                <span className="font-bold text-foreground">
                  {isCancelScheduled ? `Cancels on ${periodEndDate}` : `Renews on ${periodEndDate}`}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-background/50 border border-border/60 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Monthly Quota
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <ShieldCheck className="size-3.5 text-violet-500" />
                <span className="font-bold text-foreground">20 Complaints / Month</span>
              </div>
            </div>
          </div>

          {/* Notice if cancellation is scheduled */}
          {isCancelScheduled && (
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground flex items-center gap-2.5">
              <Calendar className="size-4 text-amber-500 shrink-0" />
              <span>
                Your subscription is set to conclude on <strong className="text-foreground">{periodEndDate}</strong>. Your full premium privileges and priority status will stay active until that date.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Checklist with Green Checks */}
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Your Active Premium Benefits
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {BACKEND_ENFORCED_BENEFITS.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-background/40 border border-border/50 text-xs"
              >
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground">{benefit.title}</span>
                  <p className="text-[11px] text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel Premium Subscription?"
        description={`Your Premium benefits will stay active until ${periodEndDate}. After this date, your quota will return to 5 complaints per month and filings will use standard priority. Cancel anyway?`}
        confirmText="Confirm Cancellation"
        cancelText="Keep My Subscription"
        variant="destructive"
        isLoading={isCancelling}
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
}
