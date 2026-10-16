import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileCheck,
  Scale,
  CreditCard,
  Clock,
  ShieldX,
  Mail,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `Terms of Service — ${siteConfig.name}`,
  description:
    "Review CityFix terms of service, acceptable civic reporting guidelines, complaint quotas, and subscription billing policies.",
  openGraph: {
    title: `Terms of Service — ${siteConfig.name}`,
    description:
      "Review CityFix terms of service, acceptable civic reporting guidelines, complaint quotas, and subscription billing policies.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 16, 2026";

  return (
    <div className="py-12 sm:py-20 space-y-12">
      {/* 1. Header Banner */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
          <Scale className="size-3.5" />
          <span>Platform Governance</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          These Terms of Service govern your access to the CityFix municipal complaint and civic resolution platform. By registering or submitting a report, you agree to these terms.
        </p>
        <p className="text-xs font-medium text-muted-foreground/80">
          Last updated: <span className="text-foreground font-semibold">{lastUpdated}</span>
        </p>
      </section>

      {/* 2. Main Terms Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section 1: Acceptable Use */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <FileCheck className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                1. Acceptable Civic Use
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                CityFix provides a critical channel for maintaining urban infrastructure. All users must use the service ethically, honestly, and responsibly:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Truthful Reporting:</strong> Complaints must represent genuine, observed civic issues (e.g., water leaks, streetlight failures, road hazards, or sanitation blockages) with truthful descriptions and valid locations.
                </li>
                <li>
                  <strong>Accurate Evidence:</strong> Photographic evidence must depict the actual site and condition described. Uploading fraudulent, fabricated, or unrelated imagery is strictly prohibited.
                </li>
                <li>
                  <strong>No Abusive Behavior:</strong> Harassment, profanity, defamatory remarks, or abusive language toward department managers, field technicians, or fellow residents will not be tolerated.
                </li>
                <li>
                  <strong>Emergency Reporting:</strong> CityFix is not an emergency response dispatch. For urgent life, fire, crime, or medical emergencies, users must dial <strong>999</strong> immediately.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Quotas and Monthly Limits */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Scale className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                2. Complaint Quotas & Membership Tiers
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                To maintain balanced municipal triage and prevent denial-of-service abuse, monthly filing quotas are enforced per calendar month:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Standard Citizen Tier (Free):</strong> Up to <strong>5 complaints per calendar month</strong> with standard priority dispatch according to published category SLAs.
                </li>
                <li>
                  <strong>Premium Citizen Membership:</strong> Elevated quota of up to <strong>20 complaints per calendar month</strong>, automatic HIGH initial priority placement, and prioritized dispatch queue sorting.
                </li>
                <li>
                  <strong>Attachment Limits:</strong> Standard citizens may attach up to 5 photos per complaint; Premium subscribers may upload up to 10 photos.
                </li>
              </ul>
              <p className="text-xs">
                Monthly quotas automatically reset on the first day of each calendar month at 00:00 UTC.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Premium Billing via Stripe */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <CreditCard className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                3. Premium Subscription & Stripe Billing
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                Premium citizen memberships are processed through Stripe under transparent billing terms:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Recurring Payments:</strong> Subscriptions renew automatically at the selected billing interval (monthly) unless cancelled prior to renewal.
                </li>
                <li>
                  <strong>Cancel Anytime:</strong> You may cancel your subscription at any time directly through your citizen dashboard under{" "}
                  <Link href="/dashboard/subscription" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                    Subscription Management
                  </Link>.
                </li>
                <li>
                  <strong>Access Through Billing Period:</strong> Upon cancellation, your elevated 20-ticket quota and priority dispatch benefits remain active until the end of your current paid billing cycle.
                </li>
                <li>
                  <strong>Refunds:</strong> Payments are generally non-refundable once the billing period has commenced, except where mandated by applicable consumer protection regulations.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Service Availability & SLA Targets */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                4. Service Availability & SLAs
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                CityFix enforces transparent municipal Service Level Agreements (SLAs) with published target resolution hours for each category. However:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Operational Targets:</strong> SLA countdowns represent municipal performance benchmarks and target closure timelines, not legally binding guarantees of immediate physical completion.
                </li>
                <li>
                  <strong>Unforeseen Delays:</strong> Complex underground utility repairs, severe weather events, supply chain delays, and emergency escalations may extend resolution times beyond initial target hours.
                </li>
                <li>
                  <strong>7-Day Reopen Guarantee:</strong> If a completed repair fails or proves substandard, citizens have the right to reopen the complaint within 7 days of closure for mandatory department reinspection.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Account Suspension for Misuse */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldX className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                5. Account Suspension & Misuse
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                City Administrators maintain the authority to protect platform integrity and civic operations. Accounts may be temporarily suspended or permanently deactivated if an evaluator or administrator detects:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>Repeated submission of spam, prank, or fraudulent complaint tickets.</li>
                <li>Verbal abuse, intimidation, or inappropriate conduct directed at city technicians.</li>
                <li>Unauthorized attempts to breach system authentication, tamper with audit trails, or scrape civic data.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Inquiries & Contact */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Mail className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                6. Contact & Support
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                If you have questions regarding these terms, dispute an account action, or require assistance with billing, please contact our civic operations support team:
              </p>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-xs space-y-1">
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                    {siteConfig.contact.email}
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <a href={siteConfig.contact.phoneHref} className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                    {siteConfig.contact.phone}
                  </a>
                </p>
                <p>
                  <strong>Address:</strong> {siteConfig.contact.address}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
