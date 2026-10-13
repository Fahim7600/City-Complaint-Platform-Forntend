"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[CityFix Root Application Error]", error);
  }, [error]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-background text-foreground select-none">
      {/* Background radial teal/violet glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(239,68,68,0.15),rgba(139,92,246,0.1),transparent_80%)]"
        aria-hidden="true"
      />

      {/* Stacked steps SVG at bottom */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-80 z-0 opacity-[0.05] dark:opacity-[0.08] bg-[url('/stacked-steps-haikei.svg')] bg-cover bg-bottom select-none"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-md text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.25)]">
          <AlertOctagon className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error interrupted this session. Our municipal operations
            monitoring team has logged this incident.
          </p>
        </div>

        {error.message && (
          <div className="mx-auto max-w-sm rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-400 font-mono break-words">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="default"
            size="lg"
            onClick={reset}
            className="w-full sm:w-auto font-medium shadow-md shadow-primary/20"
          >
            <RefreshCw className="size-4 mr-2" />
            Try again
          </Button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background/60 backdrop-blur-xs text-foreground px-5 h-11 text-base font-medium hover:border-violet-500 hover:text-foreground transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="size-4 mr-2" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
