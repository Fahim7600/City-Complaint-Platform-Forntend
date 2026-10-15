import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCtaBand() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#033b30] via-[#04201a] to-[#1e1040] p-8 sm:p-14 text-center text-[#f4faf7] overflow-hidden shadow-2xl shadow-teal-950/20 border border-teal-500/40">
          {/* Subtle Background Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-teal-400/15 via-transparent to-transparent"
          />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold bg-white/10 border border-white/20 text-[#f4faf7] backdrop-blur-md">
              <Sparkles className="size-3.5 text-teal-300" />
              <span>Civic Action in Action</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#f4faf7] [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
              Your city, fixed faster.
            </h2>

            <p className="text-sm sm:text-base text-[#f4faf7]/90 leading-relaxed font-normal">
              Join thousands of engaged citizens building cleaner, safer, and better-maintained communities across our city today.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl transition-all duration-300 gap-2 border-0"
                >
                  <span>Get started now</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <Link href="/dashboard/complaints/new">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 text-sm font-semibold border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/70 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-300"
                >
                  File a complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
