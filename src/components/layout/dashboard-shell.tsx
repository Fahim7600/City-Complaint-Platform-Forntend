"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { PageSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useDeniedToast } from "@/hooks/use-denied-toast";
import type { Role } from "@/types/user";
import { cn } from "@/lib/utils";

export interface DashboardShellProps {
  children: React.ReactNode;
  role?: Role;
  className?: string;
}

function DeniedToastWatcher() {
  useDeniedToast();
  return null;
}

export function DashboardShell({
  children,
  role: forcedRole,
  className,
}: DashboardShellProps) {
  const { role: authRole, isLoading } = useAuth();

  const effectiveRole = forcedRole || authRole || "CITIZEN";

  // While user session is loading, show a full shell skeleton (never a blank screen)
  if (isLoading) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar skeleton (desktop) */}
        <div className="hidden lg:flex w-64 flex-col border-r border-border/70 bg-card/60 p-4 space-y-6 shrink-0">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="space-y-3 flex-1 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
          <div className="pt-4 border-t border-border/50 space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Topbar skeleton */}
          <div className="h-16 border-b border-border/70 bg-background/80 px-6 flex items-center justify-between shrink-0">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>
          {/* Main content skeleton */}
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            <PageSkeleton />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative">
      <a
        href="#dashboard-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <React.Suspense fallback={null}>
        <DeniedToastWatcher />
      </React.Suspense>

      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(50,124,105,0.12),rgba(139,92,246,0.06),transparent_80%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(119,183,168,0.1),rgba(168,85,247,0.08),transparent_80%)]"
        aria-hidden="true"
      />

      {/* Faint stacked-steps SVG background pattern at bottom */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-72 z-0 opacity-[0.02] dark:opacity-[0.04] bg-[url('/stacked-steps-haikei.svg')] bg-cover bg-bottom select-none"
        aria-hidden="true"
      />

      {/* Desktop Sidebar (hidden < lg) */}
      <div className="hidden lg:flex shrink-0 relative z-20 h-full">
        <Sidebar role={effectiveRole} />
      </div>

      {/* Main Workspace (Topbar + Scrollable Page Content) */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full overflow-hidden">
        <Topbar role={effectiveRole} />

        <main
          id="dashboard-main-content"
          className={cn(
            "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto scrollbar-thin",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
