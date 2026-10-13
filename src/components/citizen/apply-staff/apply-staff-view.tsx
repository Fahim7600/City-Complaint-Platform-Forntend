"use client";

import * as React from "react";
import {
  Briefcase,
  HardHat,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ApplicationStatusCard } from "./application-status-card";
import { StaffApplicationForm } from "./staff-application-form";
import { useAuth } from "@/hooks/use-auth";
import { ApprovalStatus } from "@/types/user";

export function ApplyStaffView() {
  const { user, isLoading } = useAuth();
  const [reapplying, setReapplying] = React.useState(false);

  if (isLoading || !user) {
    return <PageSkeleton hasStats={false} />;
  }

  const hasExistingApplication =
    Boolean(user.approvalStatus) && !reapplying;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="Apply as Staff"
        description="Join the CityFix municipal crew to resolve community issues, manage civic resources, and serve your city."
      />

      {/* Hero Card */}
      <Card className="relative overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-600/10 via-background to-card/60 backdrop-blur-sm shadow-md">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 size-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <CardContent className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20">
              <Sparkles className="size-3" />
              Civic Workforce Program
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              Become a Municipal Technician or Manager
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              CityFix empowers verified citizens with field skills or municipal operations experience to join local public service branches. Applications are evaluated by department supervisors and city administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                <HardHat className="size-3" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">Technician Track</span>
                <p className="text-[11px] text-muted-foreground">
                  Get dispatched to on-site reports, diagnose street-level issues, and upload before/after repair proof.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                <Briefcase className="size-3" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-foreground">Manager Track</span>
                <p className="text-[11px] text-muted-foreground">
                  Manage department ticket volume, oversee technician dispatches, and escalate high-severity outages.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status or Application Form */}
      {hasExistingApplication ? (
        <ApplicationStatusCard
          user={user}
          onApplyAgain={
            user.approvalStatus === ApprovalStatus.REJECTED
              ? () => setReapplying(true)
              : undefined
          }
        />
      ) : (
        <StaffApplicationForm
          onSuccess={() => setReapplying(false)}
        />
      )}
    </div>
  );
}
