import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCtaBand() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-950 p-8 sm:p-14 text-center text-white overflow-hidden shadow-2xl border border-teal-500/30">
          {/* Subtle Background Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent"
          />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-white/10 border border-white/20 text-teal-200 backdrop-blur-md">
              <Sparkles className="size-3.5" />
              <span>Civic Action in Action</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Your city, fixed faster.
            </h2>

            <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-normal">
              Join thousands of engaged citizens building cleaner, safer, and better-maintained communities across our city today.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl transition-all duration-300 gap-2"
                >
                  <span>Get started now</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>

              <Link href="/dashboard/complaints/new">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 text-sm font-semibold border-white/40 text-white hover:bg-white/15 backdrop-blur-md transition-all duration-300"
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
