"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Play } from "lucide-react";
import { JobDetailHeader } from "./job-detail-header";
import { CitizenReportCard } from "./citizen-report-card";
import { PhotoUploader } from "./photo-uploader";
import { WorkUpdatePanel } from "./work-update-panel";
import { ProgressStepper } from "@/components/shared/complaint/progress-stepper";
import { StatusHistoryTimeline } from "@/components/shared/complaint/status-history-timeline";
import { PageSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/hooks/use-auth";
import { ComplaintStatus } from "@/types/complaint";

interface JobDetailViewProps {
  id: string;
}

export function JobDetailView({ id }: JobDetailViewProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch complaint detail
  const {
    data: complaint,
    isLoading: isComplaintLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.complaints.detail(id),
    queryFn: () => complaintService.getById(id),
    retry: 1,
  });

  // 2. Fetch attachments
  const { data: attachments = [] } = useQuery({
    queryKey: queryKeys.complaints.attachments(id),
    queryFn: () => complaintService.listAttachments(id),
    enabled: Boolean(id),
  });

  if (isComplaintLoading) {
    return <PageSkeleton />;
  }

  if (isError || !complaint) {
    notFound();
  }

  const handleAttachmentsChange = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.complaints.attachments(id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.complaints.detail(id),
    });
  };

  const isAssigned = complaint.status === ComplaintStatus.ASSIGNED;
  const isInProgress = complaint.status === ComplaintStatus.IN_PROGRESS;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* 1. Header with Title, ID, Status & SLA */}
      <JobDetailHeader job={complaint} />

      {/* 2. Two Columns Layout: Main Content on Left, Work Update Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Progress Stepper, Citizen Report, Photo Uploads, Timeline */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Lifecycle Stepper */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Lifecycle Stage
            </h3>
            <ProgressStepper status={complaint.status} />
          </div>

          {/* Citizen's Report */}
          <CitizenReportCard job={complaint} attachments={attachments} />

          {/* Field Photos (Before / After Work) */}
          <PhotoUploader
            complaintId={complaint.id}
            status={complaint.status}
            currentUserId={user?.id}
            isAdmin={user?.role === "ADMIN"}
            attachments={attachments}
            onAttachmentsChange={handleAttachmentsChange}
          />

          {/* Audit History Timeline */}
          <StatusHistoryTimeline complaint={complaint} />
        </div>

        {/* Right Column (4 cols): Sticky Work Update Panel */}
        <div className="lg:col-span-4 min-w-0">
          <WorkUpdatePanel
            complaint={complaint}
            attachments={attachments}
          />
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Under lg screen) */}
      {(isAssigned || isInProgress) && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 p-3 bg-background/95 backdrop-blur-md border-t border-border/80 z-40 shadow-2xl flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-muted-foreground block text-[10px]">Current Status</span>
            <span className="font-bold text-foreground">
              {complaint.status.replace("_", " ")}
            </span>
          </div>

          {isAssigned && (
            <Button
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              }}
              className="text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
            >
              <Play className="size-3.5 mr-1 fill-current" />
              Start work
            </Button>
          )}

          {isInProgress && (
            <Button
              onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
              }}
              className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25"
            >
              <CheckCircle2 className="size-3.5 mr-1" />
              Resolve job
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
