"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";

interface StatsChartsProps {
  countsByStatus?: Record<string, number>;
  totalComplaints?: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#f59e0b" },
  ASSIGNED: { label: "Assigned", color: "#6366f1" },
  IN_PROGRESS: { label: "In Progress", color: "#3b82f6" },
  RESOLVED: { label: "Resolved", color: "#10b981" },
  CLOSED: { label: "Closed", color: "#059669" },
  REJECTED: { label: "Rejected", color: "#f43f5e" },
  CANCELLED: { label: "Cancelled", color: "#6b7280" },
};

export function StatsCharts({
  countsByStatus = {},
  totalComplaints = 0,
}: StatsChartsProps) {
  const chartData = React.useMemo(() => {
    return Object.entries(countsByStatus)
      .map(([status, count]) => ({
        status,
        name: STATUS_LABELS[status]?.label || status,
        count,
        color: STATUS_LABELS[status]?.color || "#a855f7",
      }))
      .filter((item) => item.count > 0);
  }, [countsByStatus]);

  if (totalComplaints === 0 || chartData.length === 0) {
    return (
      <div className="py-16 text-center rounded-3xl border border-dashed border-border/80 bg-card/40">
        <EmptyState
          icon={BarChart3}
          title="No Complaint Data Available"
          description="Citywide statistical charts will populate as citizens file complaints across departments."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* 1. Bar Chart: Complaints by Lifecycle Status */}
      <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md space-y-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base text-foreground">
            Complaints by Lifecycle Status
          </h3>
          <p className="text-xs text-muted-foreground">
            Distribution of civic service tickets across operational phases.
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "currentColor" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(150,150,150,0.2)" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                        <span className="font-bold text-foreground">{data.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full" style={{ backgroundColor: data.color }} />
                          <span className="text-muted-foreground">
                            {data.count} {data.count === 1 ? "complaint" : "complaints"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut / Pie Breakdown */}
      <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md space-y-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base text-foreground">
            Resolution Proportion
          </h3>
          <p className="text-xs text-muted-foreground">
            Proportional volume of logged civic issues.
          </p>
        </div>

        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`donut-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const pct = ((data.count / totalComplaints) * 100).toFixed(1);
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 p-2.5 shadow-xl text-xs space-y-0.5">
                        <p className="font-bold text-foreground">{data.name}</p>
                        <p className="text-muted-foreground">{data.count} ({pct}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
          {chartData.map((item) => (
            <div key={item.status} className="flex items-center gap-2 text-[11px]">
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground truncate">{item.name}</span>
              <span className="font-mono font-bold text-foreground ml-auto">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
