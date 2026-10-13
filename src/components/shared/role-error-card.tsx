"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface RoleErrorCardProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  dashboardHref?: string;
  className?: string;
}

export function RoleErrorCard({
  error,
  reset,
  title = "Something went wrong",
  dashboardHref = "/dashboard",
  className,
}: RoleErrorCardProps) {
  React.useEffect(() => {
    // Log client error to console
    console.error("[CityFix Segment Error]", error);
  }, [error]);

  return (
    <div
      className={cn(
        "flex min-h-[420px] w-full items-center justify-center p-4",
        className
      )}
    >
      <Card className="w-full max-w-lg border border-rose-500/30 bg-card/90 shadow-[0_0_30px_rgba(244,63,94,0.12)] backdrop-blur-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-3 shadow-inner">
            <AlertTriangle className="size-7" />
          </div>
          <CardTitle className="font-heading text-xl font-bold tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            An unexpected error occurred while loading this section.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {error.message && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 font-mono break-words">
              {error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="default"
              onClick={reset}
              className="w-full sm:w-auto font-medium shadow-sm"
            >
              <RefreshCw className="size-4 mr-2" />
              Try again
            </Button>
            <Link
              href={dashboardHref}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background/60 px-3.5 h-9 text-sm font-medium hover:border-violet-500 hover:text-foreground transition-all duration-300 w-full sm:w-auto"
            >
              <Home className="size-4 mr-2" />
              Go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
