import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Wrench,
  UserCheck,
  Crown,
  ArrowRight,
  Sparkles,
  Award,
  Eye,
  Zap,
} from "lucide-react";
import { publicServerService } from "@/services/public.server";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `About Us — ${siteConfig.name}`,
  description:
    "Learn about CityFix's civic mission, our SLA-backed complaint lifecycle, and how citizens, technicians, managers, and administrators work together.",
  openGraph: {
    title: `About Us — ${siteConfig.name}`,
    description:
      "Learn about CityFix's civic mission, our SLA-backed complaint lifecycle, and how citizens, technicians, managers, and administrators work together.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Municipal Field Operations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us — ${siteConfig.name}`,
    description:
      "Learn about CityFix's civic mission, our SLA-backed complaint lifecycle, and how citizens, technicians, managers, and administrators work together.",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default async function AboutPage() {
  let overview = null;
  try {
    overview = await publicServerService.getOverview();
  } catch (err) {
    console.warn("[AboutPage] Could not fetch public overview:", err);
  }

  const rolesData = overview?.roles || {
    citizen: [
      "File civic complaints with photo evidence and GPS tags",
      "Track real-time progress through clear SLA countdowns",
      "Rate and review technicians with immutable 1-to-5 star ratings",
      "Reopen complaints within 7 days if an issue reoccurs",
    ],
    technician: [
      "Dedicated mobile-optimized work order queue",
      "Toggle on-duty availability for new assignments",
      "Upload before-work and after-work photographic proof",
      "Submit progress notes directly to department managers",
    ],
    manager: [
      "Triage incoming complaints and enforce department SLAs",
      "Assign and reassign available technicians to work orders",
      "Review technician performance and staff applications",
      "Escalate critical or bottlenecked tickets to central administrators",
    ],
    admin: [
      "Citywide governance across all municipal agencies and service categories",
      "Manage central escalation queue and emergency reassignments",
      "Audit systemwide payments, Stripe subscriptions, and financial volume",
      "Run automated SLA overdue sweeps and system health audits",
    ],
  };

  const lifecycleSteps = [
    {
      step: 1,
      title: "Filed",
      status: "PENDING",
      desc: "Citizen submits issue with photo proof & GPS.",
    },
    {
      step: 2,
      title: "Assigned",
      status: "ASSIGNED",
      desc: "Routed to dept manager & assigned to technician.",
    },
    {
      step: 3,
      title: "In Progress",
      status: "IN_PROGRESS",
      desc: "Technician performs on-site repairs with evidence.",
    },
    {
      step: 4,
      title: "Resolved",
      status: "RESOLVED",
      desc: "Work verified complete with after-work photos.",
    },
    {
      step: 5,
      title: "Reviewed",
      status: "CLOSED",
      desc: "Citizen rates technician; ticket archived.",
    },
  ];

  const values = [
    {
      title: "Transparency First",
      desc: "Every complaint has an explicit SLA deadline visible to both citizens and staff. No black box bureaucracies.",
      icon: Eye,
      accent: "text-teal-500",
    },
    {
      title: "Accountable Delivery",
      desc: "Technicians document on-site repairs with mandatory before & after evidence, verified by citizen ratings.",
      icon: ShieldCheck,
      accent: "text-emerald-500",
    },
    {
      title: "Rapid Execution",
      desc: "Automated routing directly dispatches tickets to the responsible agency without intermediate delays.",
      icon: Zap,
      accent: "text-indigo-500",
    },
    {
      title: "Citizen Empowerment",
      desc: "Citizens have the legal right to reopen any ticket within 7 days if the fix fails or is substandard.",
      icon: Award,
      accent: "text-violet-500",
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-24">
      {/* 1. Header & Problem/Solution Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
              <Sparkles className="size-3.5" />
              <span>Our Civic Mission</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Transforming Civic Infrastructure Through{" "}
              <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 bg-clip-text text-transparent">
                Accountability
              </span>
            </h1>

            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                In fast-growing metropolitan centers, traditional civic complaint mechanisms fail due to lack of visibility, ambiguous responsibility, and absent deadlines. Broken water mains linger for weeks while streetlights remain dark.
              </p>
              <p>
                <strong>CityFix</strong> was built to solve this challenge. By connecting residents directly with certified department managers and field technicians under binding Service Level Agreements (SLAs), CityFix brings accountability, real-time tracking, and verified photo proof to every municipal repair.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/departments">
                <Button className="text-xs font-bold bg-gradient-to-r from-teal-500 to-indigo-600 text-white gap-2">
                  <span>Explore City Departments</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
              <Link href="/stats">
                <Button variant="outline" className="text-xs font-semibold border-border/80">
                  <span>View Citywide Resolution Stats</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-border/80">
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop"
                alt="Civic workers repairing municipal infrastructure"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-white/20 text-xs">
                <p className="font-bold text-foreground">Verified Field Technicians</p>
                <p className="text-muted-foreground text-[11px]">Direct municipal action with before and after photo verification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stepper: The Complaint Lifecycle */}
      <section className="bg-muted/20 py-20 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Transparent Operations
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
              The Complaint Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Every issue filed on CityFix follows a strict, trackable lifecycle to prevent requests from being forgotten.
            </p>
          </div>

          {/* Stepper Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {lifecycleSteps.map((s) => (
              <div
                key={s.step}
                className="relative p-5 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm space-y-3 hover:border-violet-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="size-7 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 font-mono font-bold text-xs flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                    {s.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-sm text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 4 Roles Explained */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Collaborative Ecosystem
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
            Four Roles, One Unified Platform
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Clear roles ensure accountability from the citizen on the street to the city administrator in the operations center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Citizen */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 space-y-4 flex flex-col justify-between hover:border-teal-500/40 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Users className="size-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">Citizen</h3>
                <p className="text-xs text-muted-foreground">Civic reporters & community watch</p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {rolesData.citizen.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3 text-teal-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/register" className="pt-4 border-t border-border/50 block">
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Register as Citizen →
              </span>
            </Link>
          </div>

          {/* Technician */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Wrench className="size-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">Technician</h3>
                <p className="text-xs text-muted-foreground">Frontline field specialists</p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {rolesData.technician.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/dashboard/apply-staff" className="pt-4 border-t border-border/50 block">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Apply for Technician Staff →
              </span>
            </Link>
          </div>

          {/* Manager */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 space-y-4 flex flex-col justify-between hover:border-violet-500/40 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <UserCheck className="size-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">Department Manager</h3>
                <p className="text-xs text-muted-foreground">Departmental dispatch & triage</p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {rolesData.manager.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3 text-violet-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/dashboard/apply-staff" className="pt-4 border-t border-border/50 block">
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                Apply for Department Manager →
              </span>
            </Link>
          </div>

          {/* Administrator */}
          <div className="p-6 rounded-3xl border border-border/80 bg-card/60 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div className="space-y-4">
              <div className="size-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Crown className="size-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-foreground">City Administrator</h3>
                <p className="text-xs text-muted-foreground">Central municipal governance</p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {rolesData.admin.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-border/50 block">
              <span className="text-xs text-muted-foreground/80 italic">
                Central Operations Center
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Values and Street Image */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl border border-border/80">
              <Image
                src="https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=800&auto=format&fit=crop"
                alt="Civic community members in city center"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-white/20 text-xs">
                <p className="font-bold text-foreground">Citizen-Driven Governance</p>
                <p className="text-muted-foreground text-[11px]">Empowering residents to co-create cleaner and safer neighborhoods</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Core Principles
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
                Our Operating Values
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We believe that reliable civic services are the foundation of healthy urban living. Every feature in CityFix is engineered around these core pillars.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-5 rounded-2xl border border-border/70 bg-card/50 space-y-2 hover:bg-card/90 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <v.icon className={`size-5 ${v.accent}`} />
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      {v.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
