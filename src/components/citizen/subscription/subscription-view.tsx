"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Crown,
  Loader2,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { PageSkeleton } from "@/components/shared/skeletons";
import { PricingCard } from "./pricing-card";
import { BenefitsChecklist } from "./benefits-checklist";
import { SubscriptionStatusCard } from "./subscription-status-card";
import { PaymentHistoryTable } from "./payment-history-table";
import { TestModeCard } from "./test-mode-card";
import { paymentService } from "@/services/payment.service";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { SubscriptionStatus } from "@/types/payment";
import { cn } from "@/lib/utils";

export function SubscriptionView() {
  const [selectedPlan, setSelectedPlan] = React.useState<"month" | "year">("month");
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  // Fetch current user subscription status
  const {
    data: subscriptionData,
    isLoading: isSubLoading,
  } = useQuery({
    queryKey: queryKeys.payments.subscription(),
    queryFn: () => paymentService.getMySubscription(),
  });

  // Fetch public premium tier information (pricing & benefits)
  const {
    data: premiumInfo,
    isLoading: isInfoLoading,
  } = useQuery({
    queryKey: queryKeys.public.premiumInfo(),
    queryFn: () => publicService.getPremiumInfo(),
  });

  if (isSubLoading || isInfoLoading) {
    return <PageSkeleton hasStats={false} />;
  }

  const isPremium = Boolean(subscriptionData?.isPremium);
  const subscription = subscriptionData?.subscription ?? null;

  const isSubscriptionActive =
    subscription?.status === SubscriptionStatus.ACTIVE ||
    subscription?.status === SubscriptionStatus.PAST_DUE;

  const handleCheckout = async () => {
    setIsRedirecting(true);
    try {
      const data = await paymentService.createPremiumCheckout();
      const checkoutUrl = data.url || data.checkoutUrl;
      if (!checkoutUrl) {
        throw new Error("No checkout redirect URL received from payment service.");
      }
      toast.success("Redirecting to secure Stripe checkout...");
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to initialize Stripe checkout.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <PageHeader
        title="Premium Citizen Tier"
        description="Accelerate your municipal impact with high-priority response queues, increased complaint quotas, and comprehensive resolution audits."
      />

      {isSubscriptionActive ? (
        /* STATE B: Active Premium Subscription */
        <div className="space-y-6">
          <SubscriptionStatusCard
            subscription={subscription}
            isPremium={isPremium}
          />
          <PaymentHistoryTable />
        </div>
      ) : (
        /* STATE A: Free / Not Premium — Upgrade Journey */
        <div className="space-y-8">
          {/* Animated Hero Card with Teal-to-Violet gradient border */}
          <div className="relative group p-[2px] rounded-3xl bg-gradient-to-r from-teal-500 via-primary to-violet-600 shadow-[0_0_30px_rgba(168,85,247,0.2)] animate-gradient transition-all duration-300">
            <Card className="rounded-[22px] border-0 bg-background/95 backdrop-blur-xl overflow-hidden">
              <CardContent className="p-6 sm:p-9 relative">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                      <Crown className="size-3.5 fill-violet-500" />
                      Priority Municipal Service
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                      Upgrade to Premium Citizen
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Transform how the city responds to your neighborhood reports. Enjoy automatic High-priority dispatch, 4x higher monthly filing capacity, and direct civic audits.
                    </p>
                  </div>

                  {/* Checkout CTA Button */}
                  <div className="flex flex-col items-center md:items-end gap-2.5 shrink-0">
                    <Button
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isRedirecting}
                      className={cn(
                        "w-full sm:w-auto px-7 py-6 rounded-2xl text-sm font-bold text-white shadow-xl transition-all duration-300",
                        "bg-gradient-to-r from-teal-500 via-primary to-violet-600 hover:opacity-95 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] hover:scale-[1.02]"
                      )}
                    >
                      {isRedirecting ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Redirecting to secure checkout…
                        </>
                      ) : (
                        <>
                          <Zap className="size-4 mr-2 text-amber-300 fill-amber-300" />
                          Upgrade with Stripe
                          <ArrowRight className="size-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Lock className="size-3" />
                      256-bit encrypted checkout via Stripe
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Mode Card for Evaluators */}
          <TestModeCard />

          {/* Plan Selection Cards */}
          <PricingCard
            premiumInfo={premiumInfo}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
          />

          {/* Benefits Breakdown List */}
          <BenefitsChecklist />

          {/* Bottom Upgrade Bar */}
          <Card className="border border-border/80 bg-card/60 backdrop-blur-sm p-6 text-center space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                Ready to become a civic resolution champion?
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Join hundreds of active citizens helping local municipalities detect, prioritize, and repair civic outages faster.
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isRedirecting}
              className="px-8 py-5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Redirecting to secure checkout…
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 mr-1.5" />
                  Upgrade with Stripe Now
                </>
              )}
            </Button>
          </Card>

          {/* Payment History Section */}
          <PaymentHistoryTable />
        </div>
      )}
    </div>
  );
}
