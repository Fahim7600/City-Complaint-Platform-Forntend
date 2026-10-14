"use client";

import * as React from "react";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicPremiumInfo } from "@/types/payment";

interface PricingCardProps {
  premiumInfo?: PublicPremiumInfo | null;
}

export function PricingCard({ premiumInfo }: PricingCardProps) {
  // Backend returns converted amount in standard units: amount: (stripePrice.unit_amount || 0) / 100
  const price = premiumInfo?.price;
  const amount = price?.amount ?? 9.99;
  const currency = price?.currency || "usd";
  const interval = price?.interval;

  const formattedPrice = React.useMemo(() => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
    }
  }, [amount, currency]);

  const billingIntervalLabel = interval ? `/ ${interval}` : "one-time payment";

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-lg font-bold text-foreground">
          Premium Membership Plan
        </h3>
        <p className="text-xs text-muted-foreground">
          Single transparent subscription directly synchronized with municipal operations.
        </p>
      </div>

      {/* Single Real Plan Card with glowing violet neon border */}
      <div className="relative p-6 sm:p-7 rounded-2xl border border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_30px_rgba(168,85,247,0.22)] bg-gradient-to-b from-violet-500/10 via-background to-card/90 backdrop-blur-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 border border-violet-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
              <Crown className="size-6 fill-violet-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading text-base sm:text-lg font-extrabold text-foreground">
                  Citizen PRO Tier
                </h4>
                <Badge className="bg-violet-600 text-white border-0 text-[10px] font-bold">
                  Official Tier
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full municipal priority response and heightened monthly capacity
              </p>
            </div>
          </div>

          {/* Price Tag */}
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-1.5 sm:justify-end">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-xs font-semibold text-muted-foreground lowercase">
                {billingIntervalLabel}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Processed securely via Stripe Billing
            </p>
          </div>
        </div>

        {/* Backend Enforced Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50 border border-border/50">
            <Zap className="size-4 text-violet-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">Automatic High Priority</span>
              <p className="text-[11px] text-muted-foreground">
                All complaints auto-flagged High for expedited triage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50 border border-border/50">
            <Sparkles className="size-4 text-violet-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">20 Complaints / Month</span>
              <p className="text-[11px] text-muted-foreground">
                4x higher monthly filing capacity (increased from 5).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50 border border-border/50">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">10 Photo Uploads per Ticket</span>
              <p className="text-[11px] text-muted-foreground">
                Enhanced evidence uploads (increased from 5).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50 border border-border/50">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">Top-of-Queue Staff Sorting</span>
              <p className="text-[11px] text-muted-foreground">
                Technicians and managers see your filings first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
