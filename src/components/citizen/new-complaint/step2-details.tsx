"use client";

import * as React from "react";
import { Crown, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Priority } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface Step2DetailsProps {
  title: string;
  description: string;
  priority: Priority;
  isPremium?: boolean;
  errors?: {
    title?: string;
    description?: string;
    priority?: string;
  };
  onChange: (field: "title" | "description" | "priority", value: string) => void;
}

export function Step2Details({
  title,
  description,
  priority,
  isPremium = false,
  errors,
  onChange,
}: Step2DetailsProps) {
  const titleLength = title.length;
  const descLength = description.length;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Complaint Details
        </h3>
        <p className="text-xs text-muted-foreground">
          Provide a descriptive title and detailed summary so municipal workers can diagnose and resolve the issue quickly.
        </p>
      </div>

      {/* Title Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="complaint-title" className="text-xs font-semibold">
            Complaint Title <span className="text-destructive">*</span>
          </Label>
          <span
            className={cn(
              "text-[11px] font-mono",
              titleLength < 5 && titleLength > 0
                ? "text-rose-500 font-semibold"
                : "text-muted-foreground"
            )}
          >
            {titleLength}/100 (min 5)
          </span>
        </div>
        <Input
          id="complaint-title"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          maxLength={100}
          placeholder="e.g. Large pothole damaging vehicles on Main St near 5th Ave"
          className={cn(
            "h-10 bg-background/80 border-border/70 focus-visible:ring-violet-500/30",
            errors?.title && "border-destructive focus-visible:ring-destructive/30"
          )}
        />
        {errors?.title && (
          <p className="text-xs font-medium text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="complaint-description" className="text-xs font-semibold">
            Detailed Description <span className="text-destructive">*</span>
          </Label>
          <span
            className={cn(
              "text-[11px] font-mono",
              descLength < 10 && descLength > 0
                ? "text-rose-500 font-semibold"
                : "text-muted-foreground"
            )}
          >
            {descLength}/1000 (min 10)
          </span>
        </div>
        <Textarea
          id="complaint-description"
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          maxLength={1000}
          rows={5}
          placeholder="Describe the problem, severity, hazards, and any relevant circumstances or reference landmarks..."
          className={cn(
            "resize-y bg-background/80 border-border/70 focus-visible:ring-violet-500/30",
            errors?.description && "border-destructive focus-visible:ring-destructive/30"
          )}
        />
        {errors?.description && (
          <p className="text-xs font-medium text-destructive">
            {errors.description}
          </p>
        )}
      </div>

      {/* Priority Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Priority Level</Label>
          {isPremium && (
            <Badge
              variant="outline"
              className="text-[11px] border-amber-400/40 bg-amber-400/10 text-amber-500 gap-1"
            >
              <Crown className="size-3 fill-amber-500 text-amber-500" />
              Auto High Priority (Premium)
            </Badge>
          )}
        </div>

        {isPremium ? (
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3">
            <Sparkles className="size-5 text-amber-500 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Because you are a <strong className="text-amber-500 font-semibold">Premium Citizen</strong>,
              your complaints are automatically tagged as <strong className="text-foreground">HIGH PRIORITY</strong> by the system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: Priority.LOW,
                label: "Low",
                desc: "Minor inconvenience, no immediate safety risk",
                border: "hover:border-slate-400",
                selected: "border-slate-500 bg-slate-500/10 ring-2 ring-slate-500/30",
              },
              {
                id: Priority.MEDIUM,
                label: "Medium",
                desc: "Moderate issue requiring attention",
                border: "hover:border-amber-400",
                selected: "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30",
              },
              {
                id: Priority.HIGH,
                label: "High",
                desc: "Hazardous, acute damage or public safety risk",
                border: "hover:border-rose-400",
                selected: "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/30",
              },
            ].map((p) => {
              const isSelected = priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChange("priority", p.id)}
                  className={cn(
                    "text-left p-3.5 rounded-xl border transition-all duration-200 bg-card/60",
                    p.border,
                    isSelected ? p.selected : "border-border/70"
                  )}
                >
                  <p className="font-heading text-xs font-bold text-foreground">
                    {p.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
