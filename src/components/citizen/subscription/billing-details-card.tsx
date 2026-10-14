"use client";

import * as React from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  FileCheck2,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";
import type { Subscription } from "@/types/payment";
import { SubscriptionStatus } from "@/types/payment";

interface BillingDetailsCardProps {
  subscription: Subscription | null;
  isPremium: boolean;
}

export function BillingDetailsCard({
  subscription,
  isPremium,
}: BillingDetailsCardProps) {
  const isSubscriptionActive =
    subscription?.status === SubscriptionStatus.ACTIVE ||
    subscription?.status === SubscriptionStatus.PAST_DUE;

  const startedDate = subscription?.createdAt
    ? formatDate(subscription.createdAt)
    : "—";

  const periodEndDate = subscription?.currentPeriodEnd
    ? formatDate(subscription.currentPeriodEnd)
    : "—";

  const isCancelScheduled = Boolean(subscription?.cancelAtPeriodEnd);

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-violet-500" />
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Billing & Subscription Details
            </h3>
          </div>

          <Badge
            variant="outline"
            className={
              isPremium
                ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs"
                : "border-border text-muted-foreground text-xs"
            }
          >
            {isPremium ? (
              <span className="flex items-center gap-1">
                <Crown className="size-3 fill-amber-500" />
                Premium Active
              </span>
            ) : (
              "Standard Citizen Tier"
            )}
          </Badge>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Status */}
          <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="size-3 text-primary" />
              Account Plan
            </span>
            <p className="font-bold text-foreground text-sm pt-0.5">
              {isPremium ? "Citizen PRO" : "Standard Citizen"}
            </p>
            <span className="text-[10px] text-muted-foreground">
              {isSubscriptionActive ? "Monthly subscription" : "Free civic plan"}
            </span>
          </div>

          {/* Started Date */}
          <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Clock className="size-3 text-primary" />
              Activated On
            </span>
            <p className="font-bold text-foreground text-sm pt-0.5">
              {isSubscriptionActive ? startedDate : "Account Creation"}
            </p>
            <span className="text-[10px] text-muted-foreground">
              {isSubscriptionActive ? "Initial activation" : "Standard tier"}
            </span>
          </div>

          {/* Current Period End / Cycle */}
          <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Calendar className="size-3 text-primary" />
              {isCancelScheduled ? "Access Expiry" : "Next Billing Date"}
            </span>
            <p className="font-bold text-foreground text-sm pt-0.5">
              {isSubscriptionActive ? periodEndDate : "None (Free)"}
            </p>
            <span className="text-[10px] text-muted-foreground">
              {isCancelScheduled
                ? "Cancels on period end"
                : isSubscriptionActive
                ? "Renews automatically"
                : "No recurring charge"}
            </span>
          </div>

          {/* Enforced Monthly Quotas */}
          <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="size-3 text-primary" />
              Complaint Quota
            </span>
            <p className="font-bold text-foreground text-sm pt-0.5">
              {isPremium ? "20 Reports / Month" : "5 Reports / Month"}
            </p>
            <span className="text-[10px] text-muted-foreground">
              {isPremium ? "Up to 10 uploads/file" : "Up to 5 uploads/file"}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border/40 text-[11px] text-muted-foreground flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="size-3.5 text-muted-foreground shrink-0" />
            <span>
              All transactions are secured by Stripe Payments Europe, Ltd. Invoices and receipts are emailed directly upon successful billing.
            </span>
          </div>
          {isSubscriptionActive && (
            <span className="font-mono text-[10px] text-muted-foreground/80 shrink-0">
              Stripe Customer Linked
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
