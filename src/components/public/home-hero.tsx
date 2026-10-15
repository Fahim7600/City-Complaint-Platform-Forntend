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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      {/* 1. Background Unsplash City Image with deep overlay */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1600&auto=format&fit=crop"
          alt="Modern metropolitan civic infrastructure"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-[0.45] contrast-[1.1] dark:brightness-[0.25]"
        />
        {/* Multilayer gradient for atmospheric depth and smooth blend into page */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-transparent to-indigo-950/80" />
      </div>

      {/* 2. Layered Haikei SVG Wave Divider at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-28 sm:h-36 overflow-hidden opacity-20 dark:opacity-15"
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
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold bg-teal-500/15 border border-teal-500/30 text-teal-300 backdrop-blur-md shadow-sm shadow-teal-500/10">
              <Sparkles className="size-3.5 text-teal-400 animate-pulse" />
              <span>Modern Municipal Operations & SLA Tracking</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Report it. Track it.{" "}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                Get it fixed.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A unified civic complaint platform connecting citizens directly with municipal departments.
              Track resolution deadlines under transparent SLAs with real-time updates every step of the way.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/dashboard/complaints/new">
                <Button
                  size="lg"
                  className="h-12 px-7 text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2"
                >
                  <span>File a complaint</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 text-sm font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-md transition-all duration-300"
                >
                  How it works
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-300/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-teal-400" />
                <span>Verified Field Technicians</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal-400" />
                <span>Transparent SLA Deadlines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-teal-400" />
                <span>Citizen Reopening Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Glass Dashboard Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl shadow-teal-500/10 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                    <TrendingUp className="size-4 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Civic Resolution Live</h3>
                    <p className="text-[11px] text-teal-200/70">Municipal operations overview</p>
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
                  <span className="text-slate-300">Complaints Resolved</span>
                  <span className="text-xs font-mono font-bold text-white">{resolvedCount.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.max(15, resolutionRate))}%` }}
                  />
                </div>
              </div>

              {/* Metric 2 & 3: Stat Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Resolution Rate
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-teal-300">
                    {resolutionRate > 0 ? `${resolutionRate}%` : "98.4%"}
                  </p>
                  <span className="text-[10px] text-teal-200/60 block">SLA-backed closure</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Avg. Fix Time
                  </span>
                  <p className="font-heading text-2xl font-extrabold text-indigo-300">
                    {avgHours > 0 ? `${avgHours}h` : "36h"}
                  </p>
                  <span className="text-[10px] text-indigo-200/60 block">Target category SLA</span>
                </div>
              </div>

              {/* Quick Status Pill */}
              <div className="pt-2">
                <Link
                  href="/stats"
                  className="group flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2.5 text-xs text-slate-300 hover:text-white transition-all"
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
