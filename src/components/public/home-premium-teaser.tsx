import * as React from "react";
import Link from "next/link";
import { Check, Crown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicOverview } from "@/types/stats";

interface HomePremiumTeaserProps {
  overview?: PublicOverview | null;
}

export function HomePremiumTeaser({ overview }: HomePremiumTeaserProps) {
  const premiumPlan = overview?.plans?.premium;
  const price = premiumPlan?.price;
  const benefits = premiumPlan?.benefits || [
    "Automatic HIGH priority on every new complaint",
    "Elevated monthly quota of 20 complaints",
    "Staff queues sorted with high priority tickets first",
    "Cancel anytime directly from your dashboard",
  ];

  const formattedPrice = price
    ? `${price.currency.toUpperCase() === "USD" ? "$" : `${price.currency.toUpperCase()} `}${price.amount}`
    : "$9.99";

  const intervalText = price?.interval ? `/${price.interval}` : "/month";

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background via-violet-950/10 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-br from-card/90 via-card/60 to-violet-950/20 p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl shadow-violet-500/5 overflow-hidden">
          {/* Subtle Glow Circle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading & Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-violet-500/15 border border-violet-500/30 text-violet-700 dark:text-violet-300">
                <Crown className="size-3.5" />
                <span>Priority Citizen Membership</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Accelerate Your Civic Issues with{" "}
                <span className="bg-gradient-to-r from-violet-700 via-indigo-700 to-teal-700 dark:from-violet-400 dark:via-indigo-300 dark:to-teal-300 bg-clip-text text-transparent">
                  CityFix Premium
                </span>
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Support city infrastructure while receiving automatic high-priority queuing, expedited manager dispatch, and an elevated complaint quota.
              </p>

              {/* Benefits list */}
              <ul className="space-y-3 pt-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                    <div className="size-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-300">
                      <Check className="size-3" />
                    </div>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Price Box & CTA */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl border border-border/80 bg-background/80 p-6 sm:p-8 space-y-6 text-center shadow-xl backdrop-blur-md">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Monthly Membership
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-foreground">
                      {formattedPrice}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {intervalText}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Billed automatically via Stripe • Cancel anytime
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <Link href="/pricing" className="block w-full">
                    <Button
                      size="lg"
                      className="w-full text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Compare Plans & Upgrade</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>

                  <p className="text-[10px] text-muted-foreground">
                    Free plan remains available to all registered citizens forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
