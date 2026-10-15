"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { StatsChartsProps } from "./stats-charts";

const StatsCharts = dynamic(
  () => import("./stats-charts").then((mod) => mod.StatsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-8 h-80 rounded-3xl border border-border/60 bg-card/40 animate-pulse" />
        <div className="lg:col-span-4 h-80 rounded-3xl border border-border/60 bg-card/40 animate-pulse" />
      </div>
    ),
  }
);

export function StatsChartsWrapper(props: StatsChartsProps) {
  return <StatsCharts {...props} />;
}
