"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Moon, Sun, SunMedium, Wrench } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function JobsHeader() {
  const { user } = useAuth();
  const greeting = getGreeting();
  const firstName = user?.name ? user.name.split(" ")[0] : "Technician";
  const isAvailable = user?.isAvailable ?? true;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-foreground">
            {greeting}, {firstName}
          </h1>

          {/* Inline Availability Pill */}
          <Link
            href="/technician/profile"
            className="group inline-flex items-center gap-1.5 focus:outline-none"
            title="Click to change your dispatch availability"
          >
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all duration-300 group-hover:scale-105 cursor-pointer shadow-sm",
                isAvailable
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/25 group-hover:border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 group-hover:bg-amber-500/25 group-hover:border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  isAvailable
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-500"
                )}
              />
              <span>{isAvailable ? "Available" : "On leave"}</span>
              <ArrowRight className="size-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
            </Badge>
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your field assignments, track resolution deadlines, and log progress reports.
        </p>
      </div>
    </div>
  );
}
