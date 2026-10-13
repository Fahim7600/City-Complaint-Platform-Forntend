"use client";

import * as React from "react";
import {
  Ban,
  Check,
  CheckCircle2,
  FileCheck2,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";
import { ComplaintStatus } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  status: ComplaintStatus;
}

const STEP_ORDER = [
  { key: ComplaintStatus.PENDING, label: "Filed", icon: FileCheck2 },
  { key: ComplaintStatus.ASSIGNED, label: "Assigned", icon: UserCheck },
  { key: ComplaintStatus.IN_PROGRESS, label: "In Progress", icon: Wrench },
  { key: ComplaintStatus.RESOLVED, label: "Resolved", icon: CheckCircle2 },
];

export function ProgressStepper({ status }: ProgressStepperProps) {
  const isCancelled = status === ComplaintStatus.CANCELLED;
  const isRejected = status === ComplaintStatus.REJECTED;

  // Determine current active step index (0 to 3)
  let currentStepIndex = 0;
  if (status === ComplaintStatus.ASSIGNED) currentStepIndex = 1;
  else if (status === ComplaintStatus.IN_PROGRESS) currentStepIndex = 2;
  else if (
    status === ComplaintStatus.RESOLVED ||
    status === ComplaintStatus.CLOSED
  )
    currentStepIndex = 3;

  return (
    <div className="w-full space-y-4 py-2">
      {/* If CANCELLED or REJECTED: Show red end state */}
      {isCancelled || isRejected ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/30">
              {isCancelled ? <Ban className="size-5" /> : <XCircle className="size-5" />}
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-rose-600 dark:text-rose-400">
                Complaint {isCancelled ? "Cancelled" : "Rejected"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isCancelled
                  ? "This ticket was cancelled by the citizen and is closed."
                  : "This complaint was rejected by municipal review."}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 shrink-0">
            {isCancelled ? "Cancelled" : "Rejected"}
          </span>
        </div>
      ) : (
        /* Normal Lifecycle Stepper */
        <div className="relative">
          {/* Desktop/Tablet Line */}
          <div className="hidden sm:block absolute top-5 left-10 right-10 h-0.5 bg-border -z-0" />
          <div
            className="hidden sm:block absolute top-5 left-10 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 -z-0 transition-all duration-500"
            style={{
              width: `calc(${(currentStepIndex / (STEP_ORDER.length - 1)) * 100}% * (100% - 5rem) / 100)`,
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
            {STEP_ORDER.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center group"
                >
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                      isCurrent &&
                        "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white ring-4 ring-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-110",
                      isCompleted &&
                        "bg-violet-600 text-white shadow-sm",
                      !isCurrent &&
                        !isCompleted &&
                        "bg-card border-2 border-border/80 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <Icon className="size-4 animate-pulse" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </div>

                  <span
                    className={cn(
                      "mt-2 text-xs font-medium transition-colors",
                      isCurrent && "font-bold text-violet-600 dark:text-violet-400",
                      isCompleted && "text-foreground font-semibold",
                      !isCurrent && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
