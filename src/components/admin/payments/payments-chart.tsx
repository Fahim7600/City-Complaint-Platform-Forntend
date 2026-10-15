"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DollarSign } from "lucide-react";

interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
  count: number;
}

interface PaymentsChartProps {
  data: MonthlyRevenuePoint[];
}

export function PaymentsChart({ data }: PaymentsChartProps) {
  const hasData = data && data.length > 0 && data.some((d) => d.revenue > 0);

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold font-heading flex items-center gap-2">
          <DollarSign className="size-4 text-emerald-500" />
          Subscription Revenue Trend
        </CardTitle>
        <CardDescription className="text-xs">
          Monthly municipal revenue generated from citizen premium memberships.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasData ? (
          <div className="py-12">
            <EmptyState
              icon={DollarSign}
              title="No revenue trend data yet"
              description="Monthly subscription aggregates will visualize here as citizens upgrade to premium tiers."
            />
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  className="text-[11px] text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-[11px] text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as MonthlyRevenuePoint;
                      return (
                        <div className="p-2.5 rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-xl text-xs space-y-1">
                          <p className="font-bold text-foreground">{item.month}</p>
                          <p className="text-emerald-500 font-semibold font-mono">
                            Revenue: ${item.revenue.toFixed(2)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.count} payment(s)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
