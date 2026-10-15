import * as React from "react";
import { FileUp, GitBranch, Wrench, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeHowItWorks() {
  const steps = [
    {
      step: "01",
      title: "File with Evidence",
      description:
        "Select your municipal category, pinpoint the location, and upload photo attachments documenting the civic issue.",
      icon: FileUp,
      accent: "from-teal-500 to-emerald-500",
    },
    {
      step: "02",
      title: "Routed to Department",
      description:
        "The system routes the complaint to the designated department. Target resolution hours and SLA countdown begin automatically.",
      icon: GitBranch,
      accent: "from-emerald-500 to-indigo-500",
    },
    {
      step: "03",
      title: "Technician Fixes",
      description:
        "A manager assigns an active municipal technician who conducts the field repairs and uploads before & after work evidence.",
      icon: Wrench,
      accent: "from-indigo-500 to-violet-500",
    },
    {
      step: "04",
      title: "You Rate & Confirm",
      description:
        "Once resolved, rate your technician with 1-to-5 stars. If the problem persists, reopen the ticket within 7 days.",
      icon: Star,
      accent: "from-violet-500 to-teal-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            End-To-End Civic Resolution
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How CityFix Works
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From initial citizen report to certified field resolution, every complaint progresses through a transparent, SLA-governed lifecycle.
          </p>
        </div>

        {/* 4 Steps Grid with connecting line on desktop */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Subtle glowing connecting line on desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-teal-500/40 via-indigo-500/40 to-violet-500/40 -z-10"
          />

          {steps.map((s) => (
            <div
              key={s.step}
              className="group relative flex flex-col items-center text-center p-6 rounded-3xl border border-border/70 bg-card/50 hover:bg-card/90 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 backdrop-blur-sm"
            >
              {/* Step Icon Badge */}
              <div
                className={`relative size-16 rounded-2xl bg-gradient-to-tr ${s.accent} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="size-full rounded-[14px] bg-background/90 backdrop-blur-sm flex items-center justify-center">
                  <s.icon className="size-7 text-foreground" />
                </div>
                {/* Step pill */}
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] font-mono font-extrabold shadow-sm">
                  {s.step}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-6 space-y-2">
                <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div className="text-center pt-4">
          <Link href="/about">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
            >
              <span>Learn more about roles and SLAs</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
