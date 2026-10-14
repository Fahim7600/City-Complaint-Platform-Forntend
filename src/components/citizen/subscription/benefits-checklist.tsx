"use client";

import * as React from "react";
import {
  ArrowUpCircle,
  CheckCircle2,
  Crown,
  FileSpreadsheet,
  Headphones,
  Image as ImageIcon,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const PREMIUM_BENEFIT_LIST: BenefitItem[] = [
  {
    id: "priority",
    title: "Automatic HIGH Priority Triage",
    description:
      "All your complaint filings automatically skip standard review and receive High priority dispatch status.",
    icon: Zap,
  },
  {
    id: "quota",
    title: "Expanded Complaint Limit (20/mo)",
    description:
      "Submit up to 20 municipal reports each month (increased from the 5 reports/month free citizen limit).",
    icon: ArrowUpCircle,
  },
  {
    id: "attachments",
    title: "Enhanced Photo Evidence (10 Uploads)",
    description:
      "Attach up to 10 high-resolution photos and work documents per ticket (compared to 5 on the standard tier).",
    icon: ImageIcon,
  },
  {
    id: "reports",
    title: "Monthly Municipal Resolution Audit",
    description:
      "Receive automated monthly performance breakdowns of city actions taken across your submitted reports.",
    icon: FileSpreadsheet,
  },
  {
    id: "support",
    title: "Priority Civic Support Desk",
    description:
      "Access expedited inquiry response channels from municipal dispatch staff and ticket managers.",
    icon: Headphones,
  },
  {
    id: "badge",
    title: "Verified Citizen PRO Badge",
    description:
      "Showcase your civic contribution with a gold verified status badge displayed on your dashboard and profile.",
    icon: Crown,
  },
  {
    id: "early-access",
    title: "Early Access to Civic Pilot Programs",
    description:
      "Participate in early municipal tests, civic beta tools, and upcoming public service features first.",
    icon: Sparkles,
  },
];

interface BenefitsChecklistProps {
  className?: string;
  title?: string;
}

export function BenefitsChecklist({
  className,
  title = "Premium Citizen Privileges",
}: BenefitsChecklistProps) {
  return (
    <Card className={cn("border border-border/70 bg-card/60 backdrop-blur-sm", className)}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <Sparkles className="size-4 text-violet-500" />
          <h3 className="font-heading text-sm font-semibold text-foreground">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {PREMIUM_BENEFIT_LIST.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50 transition-all hover:border-violet-500/40"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                      {benefit.title}
                    </span>
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
