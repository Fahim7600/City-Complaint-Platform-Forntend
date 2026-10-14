"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Coffee, FilterX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JobsHeader } from "./jobs-header";
import { JobsStats } from "./jobs-stats";
import { JobsFilters } from "./jobs-filters";
import { JobCard } from "./job-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { technicianService } from "@/services/technician.service";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { getErrorMessage } from "@/lib/axios";
import { ComplaintStatus, Priority, type Complaint } from "@/types/complaint";
import type { PaginatedData } from "@/types/api";

const PRIORITY_WEIGHT: Record<Priority, number> = {
  [Priority.HIGH]: 3,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 1,
};

const ITEMS_PER_PAGE = 9;

export function JobsView() {
  const queryClient = useQueryClient();
  const { getParam, getNumberParam, setParams } = useUrlState();

  const currentTab = getParam("tab", "active");
  const searchQuery = getParam("q", "");
  const priorityFilter = getParam("priority", "");
  const sortOption = getParam("sort", "sla");
  const currentPage = getNumberParam("page", 1);

  // 1. Fetch performance stats
  const { data: performance, isLoading: isPerfLoading } = useQuery({
    queryKey: queryKeys.technicians.performance(),
    queryFn: () => technicianService.getMyPerformance(),
  });

  // 2. Fetch assigned jobs
  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.technicians.assigned({ limit: 50 }),
    queryFn: () => technicianService.getMyAssignedJobs({ limit: 50 }),
  });

  const allJobs: Complaint[] = React.useMemo(
    () => jobsData?.items || [],
    [jobsData?.items]
  );

  // Tab counts
  const counts = React.useMemo(() => {
    let active = 0;
    let resolved = 0;
    allJobs.forEach((job) => {
      if (
        job.status === ComplaintStatus.ASSIGNED ||
        job.status === ComplaintStatus.IN_PROGRESS
      ) {
        active++;
      } else if (
        job.status === ComplaintStatus.RESOLVED ||
        job.status === ComplaintStatus.CLOSED
      ) {
        resolved++;
      }
    });
    return {
      active,
      resolved,
      all: allJobs.length,
    };
  }, [allJobs]);

  const assignedCount = React.useMemo(() => {
    return allJobs.filter((j) => j.status === ComplaintStatus.ASSIGNED).length;
  }, [allJobs]);

  const inProgressCount = React.useMemo(() => {
    return allJobs.filter((j) => j.status === ComplaintStatus.IN_PROGRESS).length;
  }, [allJobs]);

  // Filter & sort logic
  const filteredAndSortedJobs = React.useMemo(() => {
    let list = [...allJobs];

    // Filter by tab
    if (currentTab === "active") {
      list = list.filter(
        (j) =>
          j.status === ComplaintStatus.ASSIGNED ||
          j.status === ComplaintStatus.IN_PROGRESS
      );
    } else if (currentTab === "resolved") {
      list = list.filter(
        (j) =>
          j.status === ComplaintStatus.RESOLVED ||
          j.status === ComplaintStatus.CLOSED
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((j) => {
        const titleMatch = j.title.toLowerCase().includes(q);
        const descMatch = j.description.toLowerCase().includes(q);
        const locMatch = j.location.toLowerCase().includes(q);
        const idMatch = j.id.toLowerCase().includes(q);
        const categoryMatch = j.category?.name.toLowerCase().includes(q);
        return titleMatch || descMatch || locMatch || idMatch || categoryMatch;
      });
    }

    // Filter by priority
    if (priorityFilter && Object.values(Priority).includes(priorityFilter as Priority)) {
      list = list.filter((j) => j.priority === priorityFilter);
    }

    // Sort
    list.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === "priority") {
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      }

      // Default: "sla" (due soonest)
      // Tickets with slaDueAt come first, sorted ascending; tickets without SLA come last
      if (!a.slaDueAt && !b.slaDueAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (!a.slaDueAt) return 1;
      if (!b.slaDueAt) return -1;
      return new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime();
    });

    return list;
  }, [allJobs, currentTab, searchQuery, priorityFilter, sortOption]);

  // Client-side pagination
  const totalItems = filteredAndSortedJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedJobs = React.useMemo(() => {
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedJobs, validPage]);

  // Quick Action: "Start work" (ASSIGNED -> IN_PROGRESS)
  const [startingJobId, setStartingJobId] = React.useState<string | null>(null);

  const startWorkMutation = useMutation({
    mutationFn: (jobId: string) =>
      complaintService.updateStatus(jobId, {
        status: ComplaintStatus.IN_PROGRESS,
      }),
    onMutate: async (jobId: string) => {
      setStartingJobId(jobId);
      await queryClient.cancelQueries({ queryKey: queryKeys.technicians.all });
      await queryClient.cancelQueries({ queryKey: queryKeys.complaints.all });

      // Snapshot previous list
      const previousJobs = queryClient.getQueryData<PaginatedData<Complaint>>(
        queryKeys.technicians.assigned({ limit: 50 })
      );

      // Optimistically update
      if (previousJobs?.items) {
        queryClient.setQueryData<PaginatedData<Complaint>>(
          queryKeys.technicians.assigned({ limit: 50 }),
          {
            ...previousJobs,
            items: previousJobs.items.map((j) =>
              j.id === jobId ? { ...j, status: ComplaintStatus.IN_PROGRESS } : j
            ),
          }
        );
      }

      return { previousJobs };
    },
    onError: (err, _jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(
          queryKeys.technicians.assigned({ limit: 50 }),
          context.previousJobs
        );
      }
      toast.error(getErrorMessage(err) || "Failed to start job.");
    },
    onSuccess: () => {
      toast.success("Job started");
    },
    onSettled: () => {
      setStartingJobId(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.technicians.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  const handleStartWork = async (jobId: string) => {
    await startWorkMutation.mutateAsync(jobId);
  };

  const handleClearFilters = () => {
    setParams(
      {
        tab: null,
        q: null,
        priority: null,
        sort: null,
        page: 1,
      },
      { resetPage: true }
    );
  };

  const isFilterActive = Boolean(
    searchQuery || priorityFilter || (sortOption && sortOption !== "sla")
  );

  return (
    <div className="space-y-6">
      {/* 1. Header with availability pill */}
      <JobsHeader />

      {/* 2. 4 StatCards */}
      <JobsStats
        performance={performance}
        assignedCount={assignedCount}
        inProgressCount={inProgressCount}
        isLoading={isPerfLoading || isJobsLoading}
      />

      {/* 3. Filter controls & tabs */}
      <JobsFilters counts={counts} />

      {/* 4. Job Cards List or Empty States */}
      {isJobsLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground text-xs">
          <Loader2 className="size-6 animate-spin text-violet-500" />
          <p>Loading assigned work orders...</p>
        </div>
      ) : isError ? (
        <EmptyState
          icon={Coffee}
          title="Could not load your jobs"
          description="Failed to connect to the municipal dispatch server. Please refresh or try again shortly."
          action={{
            label: "Retry",
            onClick: () =>
              queryClient.invalidateQueries({ queryKey: queryKeys.technicians.all }),
          }}
        />
      ) : paginatedJobs.length === 0 ? (
        isFilterActive ? (
          <EmptyState
            icon={FilterX}
            title="No jobs match your filters"
            description="We couldn't find any work orders matching your current search or priority settings."
            action={{
              label: "Reset filters",
              onClick: handleClearFilters,
            }}
          />
        ) : currentTab === "active" ? (
          <EmptyState
            icon={Coffee}
            title="No active jobs — enjoy the break ☕"
            description="You currently have no pending or in-progress service calls in your queue."
          />
        ) : (
          <EmptyState
            icon={Coffee}
            title="No jobs found"
            description="There are no tickets logged under this category tab yet."
          />
        )
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStartWork={handleStartWork}
                isStarting={startingJobId === job.id}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <PaginationControls
              meta={{
                page: validPage,
                totalPages,
                total: totalItems,
                limit: ITEMS_PER_PAGE,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
