"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-background text-foreground select-none">
      {/* Background radial teal/violet glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(50,124,105,0.18),rgba(139,92,246,0.12),transparent_80%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(119,183,168,0.15),rgba(168,85,247,0.12),transparent_80%)]"
        aria-hidden="true"
      />

      {/* Stacked steps SVG at bottom */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-80 z-0 opacity-[0.05] dark:opacity-[0.08] bg-[url('/stacked-steps-haikei.svg')] bg-cover bg-bottom select-none"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-md text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
          <Compass className="size-8" />
        </div>

        {/* Big Glowing 404 */}
        <div className="space-y-2">
          <h1 className="font-heading text-8xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-teal-800 via-teal-700 to-violet-800 dark:from-teal-300 dark:via-teal-200 dark:to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(50,124,105,0.4)]">
            404
          </h1>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The municipal resource, service portal, or complaint record you were
            looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 h-11 text-base text-primary-foreground font-medium shadow-md shadow-primary/20 hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="size-4 mr-2" />
            Go home
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full sm:w-auto font-medium border-border/80 bg-card/60 backdrop-blur-sm"
          >
            <ArrowLeft className="size-4 mr-2" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
