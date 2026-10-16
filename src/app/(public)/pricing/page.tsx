import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Crown,
} from "lucide-react";
import { publicServerService } from "@/services/public.server";
import { siteConfig } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PricingCtaIsland } from "@/components/public/pricing-cta-island";
import { HomeFaqAccordion } from "@/components/public/home-faq-accordion";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Premium Citizen Membership & Pricing — ${siteConfig.name}`,
  description:
    "Compare CityFix Free vs. Premium citizen membership plans. Automatic high priority, elevated complaint limits, and transparent billing.",
  openGraph: {
    title: `Premium Citizen Membership & Pricing — ${siteConfig.name}`,
    description:
      "Compare CityFix Free vs. Premium citizen membership plans. Automatic high priority, elevated complaint limits, and transparent billing.",
    url: `${siteConfig.url}/pricing`,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Membership & Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Premium Citizen Membership & Pricing — ${siteConfig.name}`,
    description:
      "Compare CityFix Free vs. Premium citizen membership plans. Automatic high priority, elevated complaint limits, and transparent billing.",
    images: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default async function PricingPage() {
  const [overview, premiumInfo] = await Promise.all([
    publicServerService.getOverview(),
    publicServerService.getPremiumInfo(),
  ]);

  const price = premiumInfo?.price || overview?.plans?.premium?.price;
  const benefits = premiumInfo?.benefits || overview?.plans?.premium?.benefits || [
    "Automatic HIGH priority on every new complaint",
    "Elevated monthly quota of 20 complaints",
    "Staff complaint queues sorted with high priority tickets first",
    "Cancel anytime directly from your dashboard",
  ];

  const comparisonRows = overview?.plans?.comparison || [
    {
      feature: "Monthly complaint limit",
      free: "5 complaints/month",
      premium: "20 complaints/month",
    },
    {
      feature: "Initial complaint priority",
      free: "Standard (Medium)",
      premium: "Automatic HIGH priority",
    },
    {
      feature: "Staff queue sorting",
      free: "Standard order",
      premium: "Sorted with high priority first",
    },
    {
      feature: "Real-time in-app alerts",
      free: "Included",
      premium: "Included",
    },
    {
      feature: "Reopen window",
      free: "7 days from resolution",
      premium: "7 days from resolution",
    },
    {
      feature: "Technician ratings & reviews",
      free: "Included",
      premium: "Included",
    },
    {
      feature: "Subscription flexibility",
      free: "Free forever",
      premium: "Cancel anytime with access through period end",
    },
  ];

  const formattedPrice = price
    ? `${price.currency.toUpperCase() === "USD" ? "$" : `${price.currency.toUpperCase()} `}${price.amount}`
    : "$9.99";

  const intervalText = price?.interval ? `/${price.interval}` : "/month";

  const billingFaqs = [
    {
      question: "Can I cancel my Premium subscription at any time?",
      answer:
        "Yes! You can cancel your subscription with a single click from your citizen dashboard. Once cancelled, your premium benefits remain completely active until the end of your current paid billing period without any unexpected charges.",
    },
    {
      question: "What happens if a monthly renewal payment fails?",
      answer:
        "If an automated renewal payment fails, your subscription enters a grace period (past due). Your premium priority status remains active while Stripe automatically retries the payment method before any change in status occurs.",
    },
    {
      question: "Is payment processed securely?",
      answer:
        "All transactions are processed securely through Stripe test mode infrastructure with 256-bit encryption. CityFix servers never store or handle your credit card credentials.",
    },
    {
      question: "Do free citizens still receive prompt service?",
      answer:
        "Absolutely. All civic complaints are legally bound by category Service Level Agreements (SLAs). Premium provides elevated initial priority and increased monthly limits, but municipal departments are mandated to resolve all valid civic complaints within their published SLA target hours.",
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-20">
      {/* 1. Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
          <Crown className="size-3.5" />
          <span>Transparent Membership Plans</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Simple, Transparent Civic Plans
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          CityFix is free for all residents. Upgrade to Premium for automatic high-priority dispatch and an expanded monthly complaint quota.
        </p>
      </section>

      {/* 2. Side-by-Side Plan Cards */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Forever Plan */}
          <div className="p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md flex flex-col justify-between space-y-8 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Citizen Plan
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-foreground">
                  Free Forever
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Everything a resident needs to report neighborhood issues and hold city services accountable.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-extrabold text-foreground">
                  $0
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  / forever
                </span>
              </div>

              {/* Benefits */}
              <ul className="space-y-3 pt-2 text-xs text-foreground/90">
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Up to 5 complaints per calendar month</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Standard priority routing under department SLAs</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Real-time in-app status updates & notifications</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Rate technicians with 1-to-5 star reviews</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="size-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>Reopen complaints within 7-day guarantee</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-border/50">
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-xs font-semibold border-border/80"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: Premium Membership Plan */}
          <div className="relative p-8 rounded-3xl border-2 border-violet-500/50 bg-gradient-to-br from-card/95 via-card/75 to-violet-950/20 backdrop-blur-xl flex flex-col justify-between space-y-8 shadow-2xl shadow-violet-500/10">
            {/* Top Popular Pill */}
            <div className="absolute -top-3.5 right-8">
              <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 shadow-md shadow-violet-500/30">
                Most Popular
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                  <Crown className="size-3.5" />
                  <span>Priority Membership</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-foreground">
                  CityFix Premium
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatic high-priority handling and quadrupled complaint limits for dedicated civic advocates.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl sm:text-5xl font-black text-foreground">
                  {formattedPrice}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  {intervalText}
                </span>
              </div>

              {/* Benefits */}
              <ul className="space-y-3 pt-2 text-xs text-foreground/90">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 font-medium">
                    <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Island */}
            <div className="pt-6 border-t border-border/50">
              <PricingCtaIsland />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Feature Comparison Table */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Feature Comparison
          </h2>
          <p className="text-xs text-muted-foreground">
            Clear, side-by-side comparison of plan quotas, dispatch priorities, and features.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 font-heading font-bold text-foreground">
                  <th className="p-4 sm:p-5">Platform Feature</th>
                  <th className="p-4 sm:p-5 w-44">Free Plan</th>
                  <th className="p-4 sm:p-5 w-56 text-violet-600 dark:text-violet-400">
                    CityFix Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground/90">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground">
                      {row.free}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-foreground">
                      {row.premium}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Billing FAQs */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <HomeFaqAccordion faqs={billingFaqs} />
      </section>
    </div>
  );
}
