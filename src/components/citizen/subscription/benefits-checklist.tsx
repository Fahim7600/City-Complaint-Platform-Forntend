"use client";

import * as React from "react";
import {
  ArrowUpCircle,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  Image as ImageIcon,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface EnforcedBenefitItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const BACKEND_ENFORCED_BENEFITS: EnforcedBenefitItem[] = [
  {
    id: "priority",
    title: "Automatic HIGH Priority on Every Complaint",
    description:
      "All new complaint tickets are automatically assigned High priority upon filing for immediate municipal triage.",
    icon: Zap,
  },
  {
    id: "complaint-limit",
    title: "Higher Monthly Complaint Limit (20/month)",
    description:
      "Submit up to 20 civic complaint filings every calendar month (increased from the 5 complaints/month standard limit).",
    icon: ArrowUpCircle,
  },
  {
    id: "attachments-limit",
    title: "Expanded Evidence Uploads (10 Files/Upload)",
    description:
      "Attach up to 10 photos and documentation files per upload (increased from the 5 files free tier limit).",
    icon: ImageIcon,
  },
  {
    id: "queue-sorting",
    title: "Staff Complaint Queues Sorted by High Priority",
    description:
      "Department managers and field technicians see your filings at the top of their assignment queues.",
    icon: FileCheck2,
  },
  {
    id: "cancellation-flexibility",
    title: "Cancel Anytime with Retained Period Access",
    description:
      "Cancel at any point without penalty; your premium privileges remain active until the end of your billing cycle.",
    icon: CalendarCheck,
  },
];

interface BenefitsChecklistProps {
  className?: string;
  title?: string;
}

export function BenefitsChecklist({
  className,
  title = "Backend-Enforced Premium Privileges",
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
          {BACKEND_ENFORCED_BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-background/50 border border-border/50 transition-all hover:border-violet-500/40"
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
