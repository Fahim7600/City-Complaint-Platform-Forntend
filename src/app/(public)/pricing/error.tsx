"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[PricingPageError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/80 text-center space-y-6 shadow-xl">
        <div className="size-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Failed to load membership pricing
          </h2>
          <p className="text-xs text-muted-foreground">
            We couldn&rsquo;t retrieve current Stripe price data or feature comparison table.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={reset} className="text-xs font-semibold gap-1.5">
            <RefreshCw className="size-3.5" />
            <span>Try again</span>
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5">
              <Home className="size-3.5" />
              <span>Back home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
