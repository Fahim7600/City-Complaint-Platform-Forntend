"use client";

import * as React from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PublicPremiumInfo } from "@/types/payment";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  premiumInfo?: PublicPremiumInfo | null;
  selectedPlan: "month" | "year";
  onSelectPlan: (plan: "month" | "year") => void;
}

export function PricingCard({
  premiumInfo,
  selectedPlan,
  onSelectPlan,
}: PricingCardProps) {
  // Use exact backend price or sensible defaults if Stripe price lookup is null
  const baseAmount = premiumInfo?.price?.amount ?? 9.99;
  const currencyCode = (premiumInfo?.price?.currency || "usd").toUpperCase();

  const formatCurrency = (amt: number) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(amt);
    } catch {
      return `$${amt.toFixed(2)}`;
    }
  };

  // Yearly calculation: 20% discount (approx 10 months for 12 months)
  const yearlyTotal = baseAmount * 12 * 0.8;
  const yearlyPerMonth = yearlyTotal / 12;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            Select Your Subscription Plan
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose how you would like to be billed for your CityFix verified citizen privileges.
          </p>
        </div>

        {/* Plan Interval Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSelectPlan("month")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              selectedPlan === "month"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => onSelectPlan("year")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
              selectedPlan === "year"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Annual</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Plan Card */}
        <div
          onClick={() => onSelectPlan("month")}
          className={cn(
            "relative p-5 rounded-2xl border bg-card/70 backdrop-blur-sm cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4",
            selectedPlan === "month"
              ? "border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] bg-gradient-to-b from-violet-500/5 to-card/90"
              : "border-border/70 hover:border-violet-500/40 hover:shadow-md"
          )}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/20">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-foreground">
                    Monthly Citizen
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    Flexible month-to-month billing
                  </span>
                </div>
              </div>
              {selectedPlan === "month" && (
                <Badge className="bg-violet-600 text-white border-0 text-[10px] font-semibold">
                  Selected
                </Badge>
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-3xl font-extrabold text-foreground">
                  {formatCurrency(baseAmount)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  / month
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Billed monthly. Cancel anytime without penalty.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="size-3.5 text-emerald-500 shrink-0" />
              <span>Full 20 reports/month allocation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-3.5 text-emerald-500 shrink-0" />
              <span>Automatic High Priority on all tickets</span>
            </div>
          </div>
        </div>

        {/* Annual Plan Card */}
        <div
          onClick={() => onSelectPlan("year")}
          className={cn(
            "relative p-5 rounded-2xl border bg-card/70 backdrop-blur-sm cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4",
            selectedPlan === "year"
              ? "border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_25px_rgba(168,85,247,0.25)] bg-gradient-to-b from-violet-500/5 to-card/90"
              : "border-border/70 hover:border-violet-500/40 hover:shadow-md"
          )}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Crown className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-heading text-sm font-bold text-foreground">
                      Annual Champion
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                      Best Value
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    12 months of civic resolution
                  </span>
                </div>
              </div>
              {selectedPlan === "year" && (
                <Badge className="bg-violet-600 text-white border-0 text-[10px] font-semibold">
                  Selected
                </Badge>
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-3xl font-extrabold text-foreground">
                  {formatCurrency(yearlyPerMonth)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  / month
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Billed as one payment of {formatCurrency(yearlyTotal)} / year (Save 20%).
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="size-3.5 text-emerald-500 shrink-0" />
              <span>Full 240 reports/year quota pool</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-3.5 text-emerald-500 shrink-0" />
              <span>2 Months Free vs monthly billing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
