import * as React from "react";
import type { Metadata } from "next";
import {
  CheckCircle2,
  Clock,
  FileText,
  Percent,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { publicServerService } from "@/services/public.server";
import { siteConfig } from "@/lib/site-config";
import { StatCard } from "@/components/shared/stat-card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Citywide Complaint Statistics & SLAs — ${siteConfig.name}`,
  description:
    "Live civic transparency metrics: complaint resolution rates, average turnaround hours, and operational status breakdown across city departments.",
  openGraph: {
    title: `Citywide Complaint Statistics & SLAs — ${siteConfig.name}`,
    description:
      "Live civic transparency metrics: complaint resolution rates, average turnaround hours, and operational status breakdown across city departments.",
    url: `${siteConfig.url}/stats`,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Citywide Resolution Statistics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Citywide Complaint Statistics & SLAs — ${siteConfig.name}`,
    description:
      "Live civic transparency metrics: complaint resolution rates, average turnaround hours, and operational status breakdown across city departments.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

import { StatsChartsWrapper } from "@/components/public/stats-charts-wrapper";
import { DataUnavailableCard } from "@/components/public/data-unavailable-card";

export default async function StatsPage() {
  const stats = await publicServerService.getStats();

  if (!stats) {
    return (
      <div className="py-12 sm:py-20 space-y-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
            <Sparkles className="size-3.5" />
            <span>Real-Time Civic Transparency</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Citywide Resolution Metrics
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Aggregated municipal performance indicators backed by verified field repairs and guaranteed SLA countdowns.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DataUnavailableCard
            title="Live data is temporarily unavailable — refreshing shortly"
            message="Citywide complaint resolution metrics are synchronizing with municipal systems. This page automatically updates via ISR."
          />
        </section>
      </div>
    );
  }

  const totalComplaints = stats.totalComplaints || 0;
  const resolvedCount = stats.resolvedCount || 0;
  const resolutionRate = stats.resolutionRate || 0;
  const avgHours = stats.averageResolutionHours || 0;
  const countsByStatus = stats.countsByStatus || {};

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* 1. Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
          <Sparkles className="size-3.5" />
          <span>Real-Time Civic Transparency</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Citywide Resolution Metrics
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Aggregated municipal performance indicators backed by verified field repairs and guaranteed SLA countdowns.
        </p>

        {/* Refreshes note */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
          <RefreshCw className="size-3 text-teal-500" />
          <span>Refreshes automatically every 5 minutes from live operations cache.</span>
        </div>
      </section>

      {/* 2. StatCards Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Complaints Filed"
            value={totalComplaints.toLocaleString()}
            description="Civic tickets submitted citywide"
            icon={FileText}
            iconColor="blue"
          />

          <StatCard
            label="Complaints Resolved"
            value={resolvedCount.toLocaleString()}
            description="Verified field repair completions"
            icon={CheckCircle2}
            iconColor="primary"
          />

          <StatCard
            label="Resolution Rate"
            value={`${resolutionRate > 0 ? resolutionRate.toFixed(1) : 0}%`}
            description="SLA compliance benchmark"
            icon={Percent}
            iconColor="violet"
          />

          <StatCard
            label="Avg. Fix Time"
            value={`${avgHours > 0 ? avgHours.toFixed(1) : 0}h`}
            description="Average turnaround duration"
            icon={Clock}
            iconColor="amber"
          />
        </div>
      </section>

      {/* 3. Charts Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StatsChartsWrapper
          countsByStatus={countsByStatus}
          totalComplaints={totalComplaints}
        />
      </section>
    </div>
  );
}
