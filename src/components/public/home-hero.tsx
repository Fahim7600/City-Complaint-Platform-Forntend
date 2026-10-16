import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicOverview } from "@/types/stats";

interface HomeHeroProps {
  overview?: PublicOverview | null;
}

export function HomeHero({ overview }: HomeHeroProps) {
  const stats = overview?.stats;
  const resolvedCount = stats?.resolvedCount || 0;
  const resolutionRate = stats?.resolutionRate || 0;
  const avgHours = stats?.averageResolutionHours || 0;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-20 bg-slate-950">
      {/* 1. Background Unsplash City Image with consistent deep dark overlay in both themes */}
      <div className="absolute inset-0 -z-30 overflow-hidden bg-slate-950">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1600&auto=format&fit=crop"
          alt="Modern metropolitan civic infrastructure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-[0.32] contrast-[1.15]"
        />
        {/* Consistent deep dark overlay across BOTH light and dark themes (teal-900 to dark teal with subtle violet) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(3,96,76,0.88)] via-[rgba(4,32,26,0.85)] to-[rgba(76,29,149,0.75)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(168,85,247,0.18),transparent_75%)]" />
      </div>

      {/* 2. Layered Haikei SVG Wave Divider at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-28 sm:h-36 overflow-hidden opacity-20"
      >
        <Image
          src="/stacked-steps-haikei.svg"
          alt=""
          fill
          className="object-cover object-bottom"
        />
      </div>

      {/* 3. Hero Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-white/10 border border-white/20 text-[#f4faf7] backdrop-blur-md shadow-sm">
              <Sparkles className="size-3.5 text-teal-300 animate-pulse" />
              <span>Modern Municipal Operations & SLA Tracking</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#f4faf7] [text-shadow:0_2px_16px_rgba(0,0,0,0.7)] leading-[1.1]">
              Report it. Track it.{" "}
              <span className="bg-gradient-to-r from-teal-200 via-emerald-300 to-violet-300 bg-clip-text text-transparent [text-shadow:0_2px_20px_rgba(168,85,247,0.3)]">
                Get it fixed.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#f4faf7]/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
              A unified civic complaint platform connecting citizens directly with municipal departments.
              Track resolution deadlines under transparent SLAs with real-time updates every step of the way.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/dashboard/complaints/new">
                <Button
                  size="lg"
                  className="h-12 px-7 text-sm font-bold bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#c084fc] text-white shadow-[0_0_24px_rgba(168,85,247,0.7)] hover:shadow-[0_0_36px_rgba(192,132,252,0.95)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2 border-0"
                >
                  <span>File a complaint</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 text-sm font-semibold border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/70 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] backdrop-blur-md transition-all duration-300"
                >
                  How it works
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-[#f4faf7]/85 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-teal-300" />
                <span>Verified Field Technicians</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal-300" />
                <span>Transparent SLA Deadlines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-teal-300" />
                <span>Citizen Reopening Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Glass Dashboard Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-slate-950/80 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl shadow-teal-500/10 space-y-6 text-[#f4faf7]">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                    <TrendingUp className="size-4 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#f4faf7]">Civic Resolution Live</h3>
                    <p className="text-[11px] text-[#f4faf7]/80">Municipal operations overview</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live System
                </span>
              </div>

              {/* Metric 1: Resolved Count */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#f4faf7]/85">Complaints Resolved</span>
                  <span className="text-xs font-mono font-bold text-[#f4faf7]">{resolvedCount.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(15, resolutionRate))}%` }}
                  />
                </div>
              </div>

              {/* Metric 2 & 3: Stat Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#f4faf7]/80">
                    Resolution Rate
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-teal-300">
                    {resolutionRate !== undefined && resolutionRate > 0 ? `${resolutionRate.toFixed(1)}%` : "—"}
                  </p>
                  <span className="text-[10px] text-[#f4faf7]/80 block">SLA-backed closure</span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#f4faf7]/80">
                    Avg. Fix Time
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-violet-300">
                    {avgHours !== undefined && avgHours > 0 ? `${avgHours.toFixed(1)}h` : "—"}
                  </p>
                  <span className="text-[10px] text-[#f4faf7]/80 block">Target category SLA</span>
                </div>
              </div>

              {/* Quick Status Pill */}
              <div className="pt-2">
                <Link
                  href="/stats"
                  className="group flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-3.5 py-2.5 text-xs text-[#f4faf7] hover:text-white transition-all"
                >
                  <span className="font-medium">Explore all citywide statistics</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
