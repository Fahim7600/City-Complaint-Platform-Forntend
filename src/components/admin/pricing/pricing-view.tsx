"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  Copy,
  Crown,
  ExternalLink,
  Info,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import type { AdminPremiumPricing, PublicPremiumInfo } from "@/types/payment";

export function PricingView() {
  const [copied, setCopied] = React.useState(false);

  // 1. Fetch Admin Premium Pricing from Stripe via backend
  const {
    data: adminPricing,
    isLoading: isAdminPricingLoading,
    isError: isAdminPricingError,
    refetch: refetchPricing,
  } = useQuery<AdminPremiumPricing>({
    queryKey: queryKeys.admin.premiumPricing(),
    queryFn: () => adminService.getPremiumPricing(),
  });

  // 2. Fetch Public Premium Info for benefits list
  const { data: publicInfo } = useQuery<PublicPremiumInfo>({
    queryKey: queryKeys.public.premiumInfo(),
    queryFn: () => publicService.getPremiumInfo(),
  });

  // 3. Fetch Dashboard stats for citizen and premium subscriber counters
  const { data: dashboardStats } = useQuery({
    queryKey: queryKeys.admin.dashboardStats(),
    queryFn: () => adminService.getDashboardStats(),
  });

  // Calculate citizen counts
  const totalCitizens = React.useMemo(() => {
    if (!dashboardStats?.users) return 0;
    const byRole = dashboardStats.users.byRole;
    if (Array.isArray(byRole)) {
      const citizenItem = byRole.find((r) => r.role === "CITIZEN");
      if (citizenItem) {
        return typeof citizenItem._count === "number"
          ? citizenItem._count
          : citizenItem._count?._all || 0;
      }
    } else if (typeof byRole === "object") {
      return byRole.CITIZEN || 0;
    }
    return 0;
  }, [dashboardStats]);

  // Mask priceId like price_••••1234
  const rawPriceId = adminPricing?.priceId || "";
  const maskedPriceId = React.useMemo(() => {
    if (!rawPriceId) return "—";
    if (rawPriceId.length <= 8) return rawPriceId;
    const prefix = rawPriceId.slice(0, 6);
    const suffix = rawPriceId.slice(-4);
    return `${prefix}••••${suffix}`;
  }, [rawPriceId]);

  const handleCopyPriceId = () => {
    if (!rawPriceId) return;
    navigator.clipboard.writeText(rawPriceId);
    setCopied(true);
    toast.success("Price ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const amount = adminPricing?.amount ?? publicInfo?.price?.amount ?? 9.99;
  const currency = adminPricing?.currency ?? publicInfo?.price?.currency ?? "usd";
  const interval = adminPricing?.interval ?? publicInfo?.price?.interval ?? "month";

  const formattedAmount = React.useMemo(() => {
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

  const benefits = publicInfo?.benefits || [
    "Automatic High priority placement on all submitted complaints",
    "20 complaints per calendar month (increased from standard 5)",
    "Guaranteed 24h accelerated SLA resolution review target",
    "Direct supervisor notifications and priority municipal dispatch",
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header */}
      <PageHeader
        title="Premium Subscription Pricing"
        description="Monitor active Stripe subscription parameters, citizen membership adoption rates, and recurring plan benefits."
      />

      {/* 2. Top Stats: Citizens & Premium Subscribers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Registered Citizens"
          value={totalCitizens}
          description="Total citizen accounts on platform"
          icon={Users}
          iconColor="violet"
        />

        <StatCard
          label="Active Subscription Plan"
          value={formattedAmount}
          description={`Billed ${interval ? `per ${interval}` : "one-time"} via Stripe`}
          icon={Crown}
          iconColor="primary"
        />

        <StatCard
          label="Billing Integration"
          value="Stripe Test Mode"
          description="Production-ready recurring billing"
          icon={ShieldCheck}
          iconColor="blue"
        />
      </div>

      {isAdminPricingError ? (
        <div className="py-16 text-center space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to connect to Stripe Billing API
          </p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Unable to retrieve active price details. Ensure STRIPE_SECRET_KEY and STRIPE_PREMIUM_PRICE_ID are configured in server environment.
          </p>
          <button
            onClick={() => refetchPricing()}
            className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Retry query
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Preview of Citizen Premium Card (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                  <Sparkles className="size-4 text-violet-500" />
                  Live Citizen View Preview
                </h3>
                <p className="text-xs text-muted-foreground">
                  Exact pricing card presentation rendered on the citizen upgrade portal.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400">
                Live Preview
              </Badge>
            </div>

            {/* Glowing Card matching pricing-card.tsx */}
            <div className="relative p-6 sm:p-7 rounded-2xl border border-violet-500/80 ring-2 ring-violet-500/30 shadow-[0_0_30px_rgba(168,85,247,0.18)] bg-gradient-to-b from-violet-500/10 via-background to-card/90 backdrop-blur-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 border border-violet-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                    <Crown className="size-6 fill-violet-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading text-base sm:text-lg font-extrabold text-foreground">
                        {adminPricing?.productName || "Citizen PRO Tier"}
                      </h4>
                      <Badge className="bg-violet-600 text-white border-0 text-[10px] font-bold">
                        Official Plan
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Full municipal priority response and heightened monthly capacity
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="flex items-baseline gap-1.5 sm:justify-end">
                    <span className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                      {formattedAmount}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground lowercase">
                      / {interval || "month"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Processed securely via Stripe Billing
                  </p>
                </div>
              </div>

              {/* Highlights */}
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
              </div>

              {/* Benefits list */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <p className="text-xs font-semibold text-foreground">Included Citizen Privileges:</p>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stripe Technical Parameter Details & Admin Instructions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Stripe Metadata Card */}
            <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold font-heading flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  Stripe Configuration
                </CardTitle>
                <CardDescription className="text-xs">
                  Live backend parameters returned from Stripe API.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Stripe Price ID
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-foreground">
                      {maskedPriceId}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPriceId}
                      className="h-7 px-2 text-[11px] gap-1 border-border/70"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          Copy ID
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Currency</span>
                    <p className="font-mono font-bold text-foreground uppercase">{currency}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground font-medium">Billing Cycle</span>
                    <p className="font-mono font-bold text-foreground capitalize">{interval || "Monthly"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-background/60 border border-border/50">
                  <span className="text-muted-foreground font-medium">Stripe Status</span>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Active &amp; Live
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Price Management Notice Card (Backend has no update endpoint) */}
            <Card className="border border-violet-500/30 bg-violet-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold font-heading flex items-center gap-2 text-foreground">
                  <Info className="size-4 text-violet-500" />
                  How to Update Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  The premium price is managed directly in Stripe. To modify the subscription rate:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px]">
                  <li>
                    Create a new recurring price in your{" "}
                    <span className="font-semibold text-foreground">Stripe Dashboard (Test mode)</span>.
                  </li>
                  <li>
                    Update the{" "}
                    <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground text-[10px]">
                      STRIPE_PREMIUM_PRICE_ID
                    </code>{" "}
                    environment variable on your backend server.
                  </li>
                  <li>
                    Existing subscribers continue at their grandfathered price; new subscribers are charged the updated rate.
                  </li>
                </ol>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://dashboard.stripe.com/test/prices", "_blank", "noopener,noreferrer")}
                  className="w-full text-xs font-semibold gap-1.5 border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 mt-2"
                >
                  Open Stripe Price Dashboard
                  <ExternalLink className="size-3.5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
