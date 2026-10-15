"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldAlert, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

export function PricingCtaIsland() {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="h-11 w-full rounded-xl bg-muted/60 animate-pulse" />
    );
  }

  // Case 1: Staff account (Technician, Manager, Admin)
  if (isAuthenticated && role && role !== "CITIZEN") {
    return (
      <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <ShieldAlert className="size-3.5 text-amber-500" />
          <span>Staff Account ({role})</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Premium subscriptions are designed for citizen accounts filing community complaints.
        </p>
      </div>
    );
  }

  // Case 2: Authenticated Citizen
  if (isAuthenticated && user) {
    return (
      <Link href="/dashboard/subscription" className="block w-full">
        <Button
          size="lg"
          className="w-full text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2"
        >
          <Sparkles className="size-3.5" />
          <span>Go to subscription checkout</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </Link>
    );
  }

  // Case 3: Logged-out visitor
  return (
    <Link href="/register?redirect=/dashboard/subscription" className="block w-full">
      <Button
        size="lg"
        className="w-full text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2"
      >
        <Sparkles className="size-3.5" />
        <span>Upgrade to Premium</span>
        <ArrowRight className="size-3.5" />
      </Button>
    </Link>
  );
}
