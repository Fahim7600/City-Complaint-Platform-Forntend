"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[PublicPageError]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md text-center space-y-6 shadow-2xl">
        <div className="size-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We encountered a temporary error loading public city information. Our servers may be updating municipal data.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="sm"
            onClick={reset}
            className="w-full sm:w-auto text-xs font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 text-white gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            <span>Try again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs font-semibold border-border/80 gap-1.5"
            >
              <Home className="size-3.5" />
              <span>Back home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
