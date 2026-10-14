"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border border-destructive/40 bg-card/90 backdrop-blur-md shadow-xl p-6 text-center space-y-5">
        <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertTriangle className="size-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Payment Processing Error
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error.message ||
              "An unexpected error occurred while processing your payment status."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full text-xs font-semibold"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Try Again
          </Button>

          <Link href="/dashboard/subscription" className="w-full">
            <Button variant="outline" className="w-full text-xs font-semibold">
              Subscription Page
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
