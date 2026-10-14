"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, ShieldCheck } from "lucide-react";
import type { DashboardStats } from "@/types/stats";

interface OverviewChartsProps {
  stats: DashboardStats;
}

function extractCount(val: number | { _all: number } | undefined): number {
  if (typeof val === "number") return val;
  if (val && typeof val._all === "number") return val._all;
  return 0;
}

function normalizeCounts(
  input:
    | Array<{ role?: string; status?: string; _count: number | { _all: number } }>
    | Record<string, number>
    | undefined,
  field: "role" | "status"
): Record<string, number> {
  if (!input) return {};
  if (Array.isArray(input)) {
    const map: Record<string, number> = {};
    for (const item of input) {
      const key = item[field];
      if (key) {
        map[key] = extractCount(item._count);
      }
    }
    return map;
  }
  return input;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#3b82f6", // blue
  ASSIGNED: "#8b5cf6", // violet
  IN_PROGRESS: "#f59e0b", // amber
  RESOLVED: "#10b981", // emerald
  CLOSED: "#64748b", // slate
  REJECTED: "#ef4444", // red
  CANCELLED: "#94a3b8", // gray
};

export function OverviewCharts({ stats }: OverviewChartsProps) {
  // 1. Complaints by status donut data
  const statusPieData = React.useMemo(() => {
    const map = normalizeCounts(stats.complaints.byStatus, "status");
    return Object.entries(map)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.replace("_", " "),
        statusKey: status,
        value: count,
        color: STATUS_COLORS[status] || "#8b5cf6",
      }));
  }, [stats.complaints.byStatus]);

  // 2. Department Breakdown Data: Open vs. Resolved
  const departmentBarData = React.useMemo(() => {
    if (!stats.departments) return [];
    return stats.departments.map((dep) => {
      const open =
        (dep.complaintsByStatus?.PENDING || 0) +
        (dep.complaintsByStatus?.ASSIGNED || 0) +
        (dep.complaintsByStatus?.IN_PROGRESS || 0);
      const resolved =
        (dep.complaintsByStatus?.RESOLVED || 0) +
        (dep.complaintsByStatus?.CLOSED || 0);

      return {
        name:
          dep.departmentName.length > 14
            ? `${dep.departmentName.slice(0, 12)}…`
            : dep.departmentName,
        fullName: dep.departmentName,
        Open: open,
        Resolved: resolved,
        Total: dep.totalComplaints,
      };
    });
  }, [stats.departments]);

  // 3. Department SLA performance (on-time vs overdue)
  const slaBarData = React.useMemo(() => {
    if (!stats.departments) return [];
    return stats.departments.map((dep) => {
      const overdue = dep.overdueCount || 0;
      const onTime = Math.max(0, dep.totalComplaints - overdue);
      return {
        name:
          dep.departmentName.length > 14
            ? `${dep.departmentName.slice(0, 12)}…`
            : dep.departmentName,
        fullName: dep.departmentName,
        "On-time": onTime,
        Overdue: overdue,
      };
    });
  }, [stats.departments]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chart 1: Complaints by Status Donut */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
              <PieChartIcon className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                Complaints by status
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Current lifecycle distribution
              </p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {statusPieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No complaint data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={800}
                >
                  {statusPieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover text-popover-foreground px-3 py-1.5 rounded-xl border border-border shadow-xl text-xs font-semibold">
                          <span
                            className="inline-block size-2.5 rounded-full mr-2"
                            style={{ backgroundColor: data.color }}
                          />
                          <span>
                            {data.name}: {data.value}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-[11px] text-muted-foreground">
                      {value}
                    </span>
                  )}
                  wrapperStyle={{ paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 2: Complaints by Department (Open vs Resolved) */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <BarChart3 className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                Workload by department
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Active open vs. resolved tickets
              </p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {departmentBarData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No department data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const full = payload[0].payload.fullName || label;
                      return (
                        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-xl border border-border shadow-xl text-xs space-y-1">
                          <p className="font-bold border-b border-border/50 pb-1">
                            {full}
                          </p>
                          {payload.map((p, idx) => (
                            <p key={idx} className="text-[11px]">
                              <span
                                className="inline-block size-2 rounded-full mr-1.5"
                                style={{ backgroundColor: p.color }}
                              />
                              {p.name}: <span className="font-bold">{p.value}</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-[11px] text-muted-foreground">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="Open"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
                <Bar
                  dataKey="Resolved"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 3: Department SLA Performance */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                SLA compliance by department
              </h3>
              <p className="text-[11px] text-muted-foreground">
                On-time compliance vs. SLA breach
              </p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {slaBarData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              No SLA metrics available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={slaBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const full = payload[0].payload.fullName || label;
                      return (
                        <div className="bg-popover text-popover-foreground px-3 py-2 rounded-xl border border-border shadow-xl text-xs space-y-1">
                          <p className="font-bold border-b border-border/50 pb-1">
                            {full}
                          </p>
                          {payload.map((p, idx) => (
                            <p key={idx} className="text-[11px]">
                              <span
                                className="inline-block size-2 rounded-full mr-1.5"
                                style={{ backgroundColor: p.color }}
                              />
                              {p.name}: <span className="font-bold">{p.value}</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-[11px] text-muted-foreground">
                      {value}
                    </span>
                  )}
                />
                <Bar
                  dataKey="On-time"
                  stackId="sla"
                  fill="#10b981"
                  radius={[0, 0, 0, 0]}
                  animationDuration={800}
                />
                <Bar
                  dataKey="Overdue"
                  stackId="sla"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
