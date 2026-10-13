"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Layers,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageSkeleton } from "@/components/shared/skeletons";
import { SlaCountdownCard } from "./sla-countdown-card";
import { ProgressStepper } from "./progress-stepper";
import { AttachmentsGallery } from "./attachments-gallery";
import { StatusHistoryTimeline } from "./status-history-timeline";
import { AssignedTechnicianCard } from "./assigned-technician-card";
import { CancelComplaintAction } from "@/components/citizen/cancel";
import { ReopenComplaintDialog } from "@/components/citizen/reopen";
import { ComplaintReviewSection } from "@/components/citizen/review";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { formatDateTime, formatRelativeTime } from "@/lib/format-date";

interface ComplaintDetailViewProps {
  id: string;
}

export function ComplaintDetailView({ id }: ComplaintDetailViewProps) {
  const [copied, setCopied] = React.useState(false);

  // Fetch complaint details
  const {
    data: complaint,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.complaints.detail(id),
    queryFn: () => complaintService.getById(id),
    retry: 1,
  });

  // Fetch attachments list
  const { data: attachments = [] } = useQuery({
    queryKey: queryKeys.complaints.attachments(id),
    queryFn: () => complaintService.listAttachments(id),
    enabled: Boolean(complaint),
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success("ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <PageSkeleton hasStats={false} />;
  }

  // Handle 404 or forbidden by redirecting to not-found
  if (isError || !complaint) {
    const status = (error as { statusCode?: number; response?: { status?: number } })
      ?.response?.status || (error as { statusCode?: number })?.statusCode;
    if (status === 404 || status === 403) {
      notFound();
    }

    return (
      <div className="py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-destructive">
          Failed to load complaint details
        </h3>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Network error"}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="size-3.5 mr-1.5" />
          Retry
        </Button>
      </div>
    );
  }

  const shortId = `#cpl-${id.slice(0, 8)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    complaint.location
  )}`;

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link
            href="/dashboard/complaints"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3" />
            My complaints
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground font-semibold">{shortId}</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pt-1">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted border border-border">
                {shortId}
              </span>

              <button
                type="button"
                onClick={handleCopyId}
                aria-label="Copy complaint ID"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted"
              >
                {copied ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    Copy ID
                  </>
                )}
              </button>

              <span className="text-muted-foreground text-xs">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                Filed {formatRelativeTime(complaint.createdAt)} ({formatDateTime(complaint.createdAt)})
              </span>
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {complaint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <StatusBadge status={complaint.status} size="md" />
              <StatusBadge priority={complaint.priority} size="md" />
              {complaint.isEscalated && <StatusBadge isEscalated size="md" />}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Progress, SLA, Details, Attachments, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lifecycle Stepper */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-5">
            <ProgressStepper status={complaint.status} />
          </Card>

          {/* Live SLA Countdown (hidden when resolved/closed/cancelled) */}
          <SlaCountdownCard complaint={complaint} />

          {/* Details Card */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
                Complaint Description
              </h3>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pt-1">
                {complaint.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Category
                </span>
                <p className="font-medium text-foreground flex items-center gap-1.5 pt-0.5">
                  <Layers className="size-3.5 text-violet-500" />
                  {complaint.category?.name || "General Civic Issue"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Assigned Department
                </span>
                <p className="font-medium text-foreground flex items-center gap-1.5 pt-0.5">
                  <Building2 className="size-3.5 text-primary" />
                  {complaint.department?.name || "Department unassigned"}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1 pt-1">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  Incident Location
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
                  <p className="font-medium text-foreground flex items-start gap-1.5">
                    <MapPin className="size-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{complaint.location}</span>
                  </p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0 self-start sm:self-auto"
                  >
                    Open in Google Maps
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Attachments Gallery */}
          <AttachmentsGallery attachments={attachments} />

          {/* Status History Timeline */}
          <StatusHistoryTimeline complaint={complaint} />
        </div>

        {/* Right Column (Sidebar): Assigned Technician & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Assigned Technician Card */}
          <AssignedTechnicianCard complaint={complaint} />

          {/* Review Card (Rate this service / View review) */}
          <ComplaintReviewSection complaint={complaint} />

          {/* Actions: Cancel (PENDING) or Reopen (RESOLVED) */}
          <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-5 space-y-3">
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
              Citizen Actions
            </h4>

            <div className="space-y-3 pt-1">
              {/* Cancel Button */}
              <CancelComplaintAction complaint={complaint} />

              {/* Reopen Button */}
              <ReopenComplaintDialog complaint={complaint} />

              <div className="pt-2 text-[11px] text-muted-foreground text-center">
                Need more help? Contact municipal dispatch via{" "}
                <Link href="/help" className="text-primary hover:underline font-semibold">
                  Support
                </Link>
                .
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
