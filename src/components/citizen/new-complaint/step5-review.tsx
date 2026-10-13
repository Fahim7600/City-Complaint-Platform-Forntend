"use client";

import * as React from "react";
import Image from "next/image";
import {
  Building2,
  Edit2,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { DraftCategory, DraftDetails, DraftLocation } from "@/store/complaint-draft-store";

interface Step5ReviewProps {
  category: DraftCategory | null;
  details: DraftDetails;
  location: DraftLocation;
  files: File[];
  filePreviews: { id: string; url: string; name: string; size: number; isPdf: boolean }[];
  isPremium?: boolean;
  onJumpToStep: (step: number) => void;
}

export function Step5Review({
  category,
  details,
  location,
  files,
  filePreviews,
  isPremium = false,
  onJumpToStep,
}: Step5ReviewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Review & Confirmation
        </h3>
        <p className="text-xs text-muted-foreground">
          Please verify your complaint details before submission. You can click Edit on any section to make changes.
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 1: Category & Department */}
        <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  1. Category & Routing
                </span>
              </div>
              <h4 className="font-heading text-base font-bold text-foreground">
                {category?.name || "No category selected"}
              </h4>
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="size-3.5 text-violet-500" />
                Assigned to: <strong className="text-foreground">{category?.departmentName || "General Municipal Services"}</strong>
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(1)}
              className="text-xs text-violet-500 hover:text-violet-600 hover:bg-violet-500/10 h-8"
            >
              <Edit2 className="size-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </Card>

        {/* Section 2: Details */}
        <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                2. Details & Priority
              </span>
              <div>
                <h4 className="font-heading text-base font-bold text-foreground">
                  {details.title || "Untitled Complaint"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                  {details.description || "No description provided."}
                </p>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Priority:</span>
                <StatusBadge priority={isPremium ? "HIGH" : details.priority} size="sm" />
                {isPremium && (
                  <span className="text-[11px] font-semibold text-amber-500">
                    (Auto High - Premium)
                  </span>
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(2)}
              className="text-xs text-violet-500 hover:text-violet-600 hover:bg-violet-500/10 h-8"
            >
              <Edit2 className="size-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </Card>

        {/* Section 3: Location */}
        <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                3. Incident Location
              </span>
              <p className="flex items-start gap-1.5 text-sm font-medium text-foreground pt-0.5">
                <MapPin className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{location.address || "No location entered"}</span>
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(3)}
              className="text-xs text-violet-500 hover:text-violet-600 hover:bg-violet-500/10 h-8"
            >
              <Edit2 className="size-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </Card>

        {/* Section 4: Attachments */}
        <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  4. Evidence & Photos ({files.length})
                </span>
              </div>

              {files.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No photos or attachments uploaded (optional).
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {filePreviews.map((file) => (
                    <div
                      key={file.id}
                      className="relative size-16 rounded-lg overflow-hidden border border-border/80 bg-muted shrink-0"
                    >
                      {file.isPdf ? (
                        <div className="flex flex-col items-center justify-center size-full p-1 text-center bg-muted/50">
                          <FileText className="size-5 text-rose-500" />
                          <span className="text-[9px] font-mono truncate w-full">
                            PDF
                          </span>
                        </div>
                      ) : (
                        <Image
                          src={file.url}
                          alt={file.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onJumpToStep(4)}
              className="text-xs text-violet-500 hover:text-violet-600 hover:bg-violet-500/10 h-8"
            >
              <Edit2 className="size-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </Card>
      </div>

      {/* Assurance banner */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4 flex items-center gap-3">
        <ShieldCheck className="size-5 text-emerald-500 shrink-0" />
        <p className="text-xs text-muted-foreground">
          By submitting this complaint, you affirm that the information is truthful to the best of your knowledge. Your ticket will be logged on the municipal ledger with an immutable audit trail.
        </p>
      </div>
    </div>
  );
}
