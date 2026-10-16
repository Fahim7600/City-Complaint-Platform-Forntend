import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Cookie,
  Archive,
  UserCheck,
  Mail,
  AlertCircle,
  FileText,
  CreditCard,
  Bell,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
  description:
    "Learn how CityFix collects, uses, and safeguards citizen and municipal staff data, complaint records, and cookies.",
  openGraph: {
    title: `Privacy Policy — ${siteConfig.name}`,
    description:
      "Learn how CityFix collects, uses, and safeguards citizen and municipal staff data, complaint records, and cookies.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 16, 2026";

  return (
    <div className="py-12 sm:py-20 space-y-12">
      {/* 1. Header Banner */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
          <ShieldCheck className="size-3.5" />
          <span>Civic Data Trust</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          At CityFix, transparency is our core operating principle. This Privacy Policy details how we handle your personal information, photographic evidence, and civic records.
        </p>
        <p className="text-xs font-medium text-muted-foreground/80">
          Last updated: <span className="text-foreground font-semibold">{lastUpdated}</span>
        </p>
      </section>

      {/* 2. Main Policy Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section 1: Data We Collect */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <FileText className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                1. Information We Collect
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                To coordinate municipal services and fulfill Service Level Agreements (SLAs), CityFix collects the following categories of information:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Personal Identity:</strong> Your full name, email address, and optional phone number provided during account registration.
                </li>
                <li>
                  <strong>Google OAuth Data:</strong> When signing in with Google, we receive your verified Google profile name, email address, and avatar image URL. We do not receive or store your Google password.
                </li>
                <li>
                  <strong>Complaint Submissions:</strong> Issue title, detailed description, selected category, target municipal department, physical street address, and approximate GPS location text.
                </li>
                <li>
                  <strong>Photo Evidence:</strong> Images uploaded to document civic issues and field repairs, hosted securely on Cloudinary.
                </li>
                <li>
                  <strong>Payment & Subscription Records:</strong> When upgrading to CityFix Premium, Stripe transmits confirmation of subscription status, tier intervals, and transaction identifiers.
                </li>
              </ul>

              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5 mt-2">
                <CreditCard className="size-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Payment Security Note:</strong> All payment card numbers, expiration dates, and CVC codes are collected directly by Stripe via encrypted tokenization. CityFix servers never receive, process, or store credit or debit card numbers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Why We Use Data */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Lock className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                2. How Your Information Is Used
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>Your information is used strictly to power civic complaint resolution and platform operations:</p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Municipal Dispatch & SLA Enforcement:</strong> Routing tickets to responsible departments, assigning field technicians, and measuring repair turnaround against public SLA benchmarks.
                </li>
                <li>
                  <strong>Real-Time Civic Notifications:</strong> Alerting citizens when complaint status changes (`ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) or when rework notes are filed.
                </li>
                <li>
                  <strong>Transactional Communications:</strong> Email dispatches for password recovery codes, staff onboarding invitations, and account alerts delivered securely via Brevo.
                </li>
                <li>
                  <strong>Quality Control:</strong> Computing technician performance metrics, average turnaround hours, and citizen review scores.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Data Access & Sharing */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <Eye className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                3. Who Can Access Your Information
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                CityFix enforces role-based access control (RBAC). Your information is only accessible by authorized actors:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Handling Department Personnel:</strong> Department managers and assigned field technicians can inspect complaint text, photo attachments, and service addresses necessary to perform physical repairs.
                </li>
                <li>
                  <strong>City Administrators:</strong> Executive oversight personnel for municipal auditing, department reassignment, and escalation management.
                </li>
                <li>
                  <strong>Other Citizens:</strong> High-level resolution statistics and department ratings are public. Individual complaint details, personal identities, and contact numbers are never sold, rented, or exposed for commercial advertising.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Cookies & Storage */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Cookie className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                4. Cookies & Browser Storage
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>CityFix uses minimal, essential cookies required for system security and usability:</p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Authentication Cookies (`cityfix_access_token` & `cityfix_user_role`):</strong> Stores your short-lived session token with `sameSite: "lax"` and `secure: true` on HTTPS connections to maintain sign-in state across pages.
                </li>
                <li>
                  <strong>Backend Session Cookie (`refreshToken`):</strong> An encrypted `httpOnly`, `SameSite=None` cookie managed directly by the backend to securely refresh expired access tokens.
                </li>
                <li>
                  <strong>Theme Preference:</strong> Remembers your light mode or dark mode display selection via local browser storage.
                </li>
              </ul>
              <p className="text-xs">
                CityFix does not deploy third-party advertising trackers, cross-site profiling beacons, or behavioral marketing cookies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Data Retention & Audit Trails */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Archive className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                5. Data Retention & Municipal Auditing
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>
                In accordance with municipal governance standards, resolved complaints and user accounts are subject to soft deletion (`deletedAt` timestamps). When an administrator or user deletes a record:
              </p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>The complaint is immediately removed from all active citizen queues and public views.</li>
                <li>The underlying audit history is retained in the secure database for legal accountability, municipal spending review, and civic transparency reporting.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: User Rights & Contact */}
        <Card className="border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <UserCheck className="size-5" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                6. Your Rights & Data Requests
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 sm:pl-13">
              <p>You maintain full control over your personal account information:</p>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li>
                  <strong>Profile Updates:</strong> You can edit your name, phone number, and avatar directly from{" "}
                  <Link href="/dashboard/profile" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                    Your Profile Dashboard
                  </Link>.
                </li>
                <li>
                  <strong>Account Deletion:</strong> You have the right to request account deactivation and removal from active systems at any time.
                </li>
                <li>
                  <strong>Privacy Questions:</strong> For inquiries regarding your personal data or to request account deletion, reach out directly to our municipal privacy desk at{" "}
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
                    {siteConfig.contact.email}
                  </a>.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
