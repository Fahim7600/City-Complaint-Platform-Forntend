"use client";

import * as React from "react";
import { CheckCircle2, Clock, FileText, Percent } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import type { PublicStats } from "@/types/stats";

interface HomeStatsStripProps {
  stats?: PublicStats | null;
}

function useCountUp(endVal: number, durationMs = 1500, startNow = false): number {
  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    if (!startNow || endVal <= 0) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      requestAnimationFrame(() => setVal(endVal));
      return;
    }

    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * endVal * 10) / 10);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setVal(endVal);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [endVal, durationMs, startNow]);

  return val;
}

export function HomeStatsStrip({ stats }: HomeStatsStripProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  const totalComplaints = stats?.totalComplaints || 0;
  const resolvedCount = stats?.resolvedCount || 0;
  const resolutionRate = stats?.resolutionRate || 0;
  const avgHours = stats?.averageResolutionHours || 0;

  const countTotal = useCountUp(totalComplaints, 1600, inView);
  const countResolved = useCountUp(resolvedCount, 1600, inView);
  const countRate = useCountUp(resolutionRate, 1400, inView);
  const countHours = useCountUp(avgHours, 1400, inView);

  const metrics = [
    {
      label: "Total Complaints Filed",
      value: inView ? Math.round(countTotal).toLocaleString() : "0",
      description: "Documented civic issues",
      icon: FileText,
      color: "from-teal-500/20 to-teal-500/5 text-teal-600 dark:text-teal-400 border-teal-500/20",
    },
    {
      label: "Resolved Issues",
      value: inView ? Math.round(countResolved).toLocaleString() : "0",
      description: "Successfully fixed & closed",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Resolution Success Rate",
      value: inView ? `${countRate.toFixed(1)}%` : "0%",
      description: "SLA compliance target",
      icon: Percent,
      color: "from-indigo-500/20 to-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      label: "Average Fix Time",
      value: inView ? `${countHours.toFixed(1)}h` : "0h",
      description: "From submission to completion",
      icon: Clock,
      color: "from-violet-500/20 to-violet-500/5 text-violet-600 dark:text-violet-400 border-violet-500/20",
    },
  ];

  return (
    <section ref={ref} className="relative -mt-10 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-border/50 transition-colors"
          >
            <div
              className={`size-12 rounded-2xl bg-gradient-to-tr ${m.color} border flex items-center justify-center shrink-0 shadow-sm`}
            >
              <m.icon className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                {m.label}
              </span>
              <p className="font-heading text-2xl font-extrabold text-foreground tracking-tight">
                {m.value}
              </p>
              <span className="text-[10px] text-muted-foreground truncate block">
                {m.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
