import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Building2, ShieldCheck, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-background">
      {/* Top Bar for Mobile & Back Navigation */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-background/80 hover:bg-muted/80 backdrop-blur-md border border-border/60 transition-all duration-200 hover:-translate-x-0.5"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to home</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* LEFT PANEL (Desktop only): Atmospheric civic visual showcase */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white bg-slate-950">
        {/* Real Unsplash City Night Photography */}
        <Image
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop"
          alt="Modern metropolitan cityscape at twilight"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center opacity-40 scale-105"
        />

        {/* Deep dark gradient overlay ensuring clear white/near-white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#033b30]/95 via-[#04201a]/90 to-[#2e1065]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />

        {/* Layered SVG steps haikei at bottom */}
        <div className="absolute inset-x-0 -bottom-10 h-72 pointer-events-none opacity-20">
          <Image
            src="/stacked-steps-haikei.svg"
            alt=""
            fill
            className="object-cover object-bottom"
          />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#327c69] to-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <span className="font-heading text-2xl font-black tracking-tight text-[#f4faf7]">
              CityFix
            </span>
            <p className="text-xs text-[#f4faf7]/85 font-medium tracking-wide">
              Municipal Grievance & Civic Service Platform
            </p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md text-[#f4faf7] border border-white/20">
            <ShieldCheck className="size-3.5 text-teal-300" />
            Verified Transparent Governance
          </div>

          <h2 className="font-heading text-3xl xl:text-4xl font-extrabold tracking-tight text-[#f4faf7] [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] leading-tight">
            Empowering citizens, streamlining municipal resolutions.
          </h2>

          <p className="text-sm xl:text-base text-[#f4faf7]/90 leading-relaxed font-normal">
            Real-time tracking of public works, direct field technician dispatching, SLA-backed complaint resolution, and community accountability for your city.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
                <Clock className="size-4 text-violet-300" />
                Guaranteed SLAs
              </div>
              <p className="text-xs text-[#f4faf7]/85">
                Potholes, sewage & lights monitored with strict resolution timelines.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold mb-1">
                <Building2 className="size-4 text-violet-300" />
                Multi-Department
              </div>
              <p className="text-xs text-[#f4faf7]/85">
                Unified portal across Roads, Water Supply, and Sanitation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="relative z-10 text-xs text-[#f4faf7]/75 font-medium">
          CityFix Civic Platform &copy; {new Date().getFullYear()} &bull; Transparent Municipal Governance
        </div>
      </div>

      {/* RIGHT PANEL: Form Container (Full width on mobile) */}
      <div className="flex-1 flex flex-col justify-center px-4 py-16 sm:px-8 md:px-12 lg:px-16 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8 pt-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#327c69] to-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Sparkles className="size-4.5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            CityFix
          </span>
        </div>

        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
