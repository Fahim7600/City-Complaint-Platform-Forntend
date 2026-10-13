"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, label: "Category" },
  { step: 2, label: "Details" },
  { step: 3, label: "Location" },
  { step: 4, label: "Photos" },
  { step: 5, label: "Review" },
];

export function StepIndicator({
  currentStep,
  totalSteps = 5,
  onStepClick,
}: StepIndicatorProps) {
  const currentStepObj = STEPS.find((s) => s.step === currentStep) || STEPS[0];
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Mobile view: "Step X of 5" + Progress bar */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            Step {currentStep} of {totalSteps}:{" "}
            <span className="text-violet-500 font-bold">{currentStepObj.label}</span>
          </span>
          <span className="text-muted-foreground">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view (>= sm): Numbered circles connected by lines */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Connecting background line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-border/80 -z-0" />

        {/* Connecting filled line */}
        <div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 -z-0 transition-all duration-500"
          style={{
            width: `calc(${progressPercent}% * (100% - 3rem) / 100)`,
          }}
        />

        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isClickable = Boolean(onStepClick && s.step < currentStep);

          return (
            <div
              key={s.step}
              className="relative z-10 flex flex-col items-center group"
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(s.step)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                  isCurrent &&
                    "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.6)] ring-4 ring-violet-500/25 scale-110",
                  isCompleted &&
                    "bg-violet-600 text-white shadow-sm hover:scale-105 cursor-pointer",
                  !isCurrent &&
                    !isCompleted &&
                    "bg-card border-2 border-border/80 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="size-4 stroke-[3]" />
                ) : (
                  s.step
                )}
              </button>

              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors duration-200",
                  isCurrent && "font-semibold text-violet-500 dark:text-violet-400",
                  isCompleted && "text-foreground",
                  !isCurrent && !isCompleted && "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
