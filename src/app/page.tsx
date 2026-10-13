import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ToastPreviewButtons } from "@/components/shared/toast-preview-buttons";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  LogOut,
  MapPin,
  ShieldAlert,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

export default function ThemePreviewPage() {
  return (
    <main className="relative min-h-screen pb-20">
      {/* Decorative Background SVG from public/ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden opacity-15 dark:opacity-20"
      >
        <Image
          src="/stacked-steps-haikei.svg"
          alt=""
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#327c69] to-[#a855f7] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                  CityFix
                </span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                  Theme Preview
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                City Complaint & Civic Service Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* // TEMP: Temporary authentication navigation until full navbar prompt */}
            <Link
              href="/login"
              className={buttonVariants({ variant: "neon", size: "sm" })}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Create account
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        {/* Animated Gradient Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-2xl p-8 sm:p-12 text-white shadow-2xl bg-animated-gradient">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              <Zap className="size-3.5 text-[#c084fc]" />
              Design System & Theming Foundation
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl drop-shadow-sm">
              Teal Palette & Neon Violet Accents
            </h1>
            <p className="mt-3 text-base sm:text-lg text-white/90 drop-shadow-sm leading-relaxed">
              Tailwind CSS v4 + shadcn/ui themed with municipal teal foundations, high-visibility neon call-to-actions, and dark mode contrast for civic governance.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="neon" size="lg">
                <Flame className="size-4" />
                Neon Call To Action
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white"
              >
                Explore Portal
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Abstract background decorative circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 right-32 size-64 rounded-full bg-[#c084fc]/20 blur-3xl"
          />
        </section>

        {/* SECTION 1: Button Variants with Neon Glow */}
        <section className="mb-14">
          <div className="mb-4">
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Button System & Glow Variants
            </h2>
            <p className="text-sm text-muted-foreground">
              Micro-interactions with smooth ease-out transitions, lift on hover, active state compression, and neon box-shadows.
            </p>
          </div>

          <div className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Variant Showcase
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button variant="default">
                  <CheckCircle2 className="size-4" />
                  Default (Teal + Violet Glow)
                </Button>
                <Button variant="neon">
                  <Flame className="size-4" />
                  Neon (Main CTA)
                </Button>
                <Button variant="outline">
                  <Sparkles className="size-4 text-accent" />
                  Outline (Glowing Border)
                </Button>
                <Button variant="destructive">
                  <Trash2 className="size-4" />
                  Destructive (Red Neon Glow)
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Destructive Critical Actions (Required for logout, delete, cancel)
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button variant="destructive" size="sm">
                  <LogOut className="size-3.5" />
                  Sign Out
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="size-3.5" />
                  Delete Complaint #1029
                </Button>
                <Button variant="destructive" size="sm">
                  <ShieldAlert className="size-3.5" />
                  Cancel Escalation
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Button Sizes
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button variant="default" size="xs">
                  Extra Small (xs)
                </Button>
                <Button variant="default" size="sm">
                  Small (sm)
                </Button>
                <Button variant="default" size="default">
                  Default Size
                </Button>
                <Button variant="default" size="lg">
                  Large Size (lg)
                </Button>
                <Button variant="neon" size="icon" aria-label="Icon Neon">
                  <Zap className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Hover Lift Cards */}
        <section className="mb-14">
          <div className="mb-4">
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Cards with Smooth <code className="text-xs font-mono text-accent">.hover-lift</code> Effect
            </h2>
            <p className="text-sm text-muted-foreground">
              Cards lift smoothly on cursor hover with responsive border highlights and dual-tone shadow glows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover-lift border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-[#327c69] text-white">
                    SLA on Track
                  </Badge>
                  <Clock className="size-4 text-muted-foreground" />
                </div>
                <CardTitle className="mt-2 text-lg">Pothole Urgent Repair</CardTitle>
                <CardDescription>Sector 14 Road Network</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Reported by 14 citizens. Road Maintenance Division dispatched equipment and hot-mix asphalt.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-accent" />
                  <span>North Boulevard & 5th Avenue</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs font-medium text-muted-foreground">ID: #CMP-8921</span>
                <Button variant="outline" size="xs">
                  View Timeline
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-lift border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="destructive">Critical Escalation</Badge>
                  <AlertCircle className="size-4 text-destructive" />
                </div>
                <CardTitle className="mt-2 text-lg">Water Main Contamination</CardTitle>
                <CardDescription>Ward 9 Distribution Line</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Pressure drop alert triggered. Water testing technician is collecting samples at distribution junction.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-destructive" />
                  <span>Greenwood Reservoir Sector</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs font-medium text-muted-foreground">ID: #CMP-9044</span>
                <Button variant="destructive" size="xs">
                  Emergency Action
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover-lift border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#a855f7] text-white hover:bg-[#9333ea]">
                    Community Upvoted
                  </Badge>
                  <Sparkles className="size-4 text-accent" />
                </div>
                <CardTitle className="mt-2 text-lg">Solar LED Streetlights</CardTitle>
                <CardDescription>Civic Enhancement Project</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  87 citizen upvotes for park periphery lighting upgrade. Approved under municipal green energy fund.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-accent" />
                  <span>Central Civic Promenade</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs font-medium text-muted-foreground">ID: #REQ-3312</span>
                <Button variant="neon" size="xs">
                  Support Request
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* SECTION 3: Sonner Top Toasts */}
        <section className="mb-14">
          <div className="mb-4">
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Top-Center Sonner Toasts
            </h2>
            <p className="text-sm text-muted-foreground">
              Configured with <code className="text-xs font-mono text-accent">position=&quot;top-center&quot;</code>, rich colors, and close buttons as required.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Test interactive notification alerts:
                </p>
                <p className="text-xs text-muted-foreground">
                  Click below to trigger live toast popups from the top center.
                </p>
              </div>
              <ToastPreviewButtons />
            </div>
          </div>
        </section>

        {/* SECTION 4: Brand Palette Verification */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Color Tokens & Variables
            </h2>
            <p className="text-sm text-muted-foreground">
              Exact palette derived from <code className="text-xs font-mono">stacked-steps-haikei.svg</code> and specified neon violet accents.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Teal Range */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Municipal Teal Palette
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between rounded p-2 bg-[#9ad6c9] text-[#03604c]">
                  <span>teal-100</span>
                  <span>#9ad6c9</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#77b7a8] text-[#03604c]">
                  <span>teal-300</span>
                  <span>#77b7a8</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#559988] text-white">
                  <span>teal-500</span>
                  <span>#559988</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#327c69] text-white">
                  <span>teal-700</span>
                  <span>#327c69</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#03604c] text-white">
                  <span>teal-900</span>
                  <span>#03604c</span>
                </div>
              </div>
            </div>

            {/* Neon Violet Range */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Neon Accent (Violet)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between rounded p-2 bg-[#c084fc] text-[#04201a]">
                  <span>violet-400</span>
                  <span>#c084fc</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#a855f7] text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]">
                  <span>violet-500</span>
                  <span>#a855f7</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#9333ea] text-white">
                  <span>violet-600</span>
                  <span>#9333ea</span>
                </div>
              </div>
            </div>

            {/* Danger Range */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Critical & Destructive (Red)
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between rounded p-2 bg-[#ef4444] text-white shadow-[0_0_12px_rgba(239,68,68,0.5)]">
                  <span>red-500</span>
                  <span>#ef4444</span>
                </div>
                <div className="flex items-center justify-between rounded p-2 bg-[#dc2626] text-white">
                  <span>red-600</span>
                  <span>#dc2626</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
