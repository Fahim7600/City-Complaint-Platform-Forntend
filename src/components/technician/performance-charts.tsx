"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, PieChartIcon, TrendingUp } from "lucide-react";

export interface TimeSeriesPoint {
  label: string;
  completed: number;
}

export interface RatingBarPoint {
  stars: string;
  count: number;
}

export interface StatusDonutPoint {
  name: string;
  value: number;
  color: string;
}

interface PerformanceChartsProps {
  timeSeriesData: TimeSeriesPoint[];
  ratingDistribution: RatingBarPoint[];
  statusDistribution: StatusDonutPoint[];
}

export function PerformanceCharts({
  timeSeriesData,
  ratingDistribution,
  statusDistribution,
}: PerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Jobs Completed Over Time (Area Chart, 12 cols or 8 cols) */}
      <Card className="lg:col-span-8 border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-6 space-y-4">
        <CardHeader className="p-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-teal-500" />
              Completed Repairs Over Time
            </CardTitle>
            <span className="text-xs text-muted-foreground">Past 8 Weeks</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeSeriesData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/40"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">
                          {payload[0].payload.label}
                        </p>
                        <p className="text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-teal-500" />
                          {payload[0].value} jobs resolved
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#14b8a6"
                strokeWidth={2.5}
                fill="url(#jobsGradient)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Donut Chart: Jobs by Status or Priority (4 cols) */}
      <Card className="lg:col-span-4 border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-6 space-y-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <PieChartIcon className="size-4 text-violet-500" />
            Active Job Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[280px] w-full flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                animationDuration={1000}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="stroke-background stroke-2"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl text-xs">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-muted-foreground">{item.value} tickets</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom legend */}
          <div className="flex flex-wrap justify-center gap-3 pt-2 text-[11px]">
            {statusDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 font-medium">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
                <span className="font-bold text-foreground">({entry.value})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Rating Distribution: Horizontal Bar Chart (12 cols) */}
      <Card className="lg:col-span-12 border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-6 space-y-4">
        <CardHeader className="p-0 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
              <Award className="size-4 text-amber-500" />
              Citizen Rating Breakdown (5★ to 1★)
            </CardTitle>
            <span className="text-xs text-muted-foreground">Citizen Verified Reviews</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={ratingDistribution}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/40"
                horizontal={false}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="stars"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "currentColor", fontWeight: 600 }}
                className="text-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">
                          {payload[0].payload.stars}
                        </p>
                        <p className="text-amber-500 font-semibold">
                          {payload[0].value} reviews
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="#f59e0b"
                radius={[0, 8, 8, 0]}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function PerformanceChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-8 p-6 space-y-4 border border-border/70 bg-card/60">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-[260px] w-full rounded-xl" />
      </Card>
      <Card className="lg:col-span-4 p-6 space-y-4 border border-border/70 bg-card/60">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-[260px] w-full rounded-xl" />
      </Card>
      <Card className="lg:col-span-12 p-6 space-y-4 border border-border/70 bg-card/60">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </Card>
    </div>
  );
}
