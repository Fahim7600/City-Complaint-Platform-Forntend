"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PremiumUpsellCard() {
  return (
    <div className="relative group rounded-2xl p-[2px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]">
      {/* Animated gradient ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 animate-pulse opacity-85 group-hover:opacity-100 transition-opacity" />

      <Card className="relative h-full border-0 bg-card/95 backdrop-blur-md rounded-[14px] overflow-hidden">
        {/* Glow backdrop inside */}
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <CardContent className="p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20 mb-1">
                <Sparkles className="size-3" />
                CityFix Citizen Plus
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground sm:text-xl">
                Get Faster Resolutions with Premium
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Upgrade to our civic priority tier to unlock higher limits, expedited technician routing, and direct escalation.
              </p>
            </div>

            <Link href="/pricing" className="shrink-0">
              <Button
                className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              >
                <Sparkles className="size-4 mr-2" />
                See Premium
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* 3 Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="size-3" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  Automated High Priority
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Every complaint you file is marked High priority and dispatched immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                <Zap className="size-3" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  10x Monthly Quota
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Submit up to 50 active complaints each month without hitting monthly ceilings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <ShieldCheck className="size-3" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  Up to 10 Attachments
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Include comprehensive photo evidence and documents for rapid diagnosis.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
