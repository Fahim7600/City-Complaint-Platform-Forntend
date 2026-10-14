"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { QueueStats } from "./queue-stats";
import { QueueFilters } from "./queue-filters";
import { QueueTable } from "./queue-table";
import { ComplaintSheet } from "./complaint-sheet";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { useAuth } from "@/hooks/use-auth";
import type { ComplaintListQuery, ComplaintStatus, Priority } from "@/types/complaint";

export function QueueView() {
  const { user } = useAuth();
  const { getParam, setParam, setParams } = useUrlState();

  const complaintId = getParam("id");
  const isSheetOpen = Boolean(complaintId);

  const page = Number(getParam("page", "1")) || 1;
  const q = getParam("q", "");
  const statusParam = getParam("status");
  const priorityParam = getParam("priority");
  const categoryIdParam = getParam("categoryId");
  const sortParam = getParam("sort", "sla");
  const unassigned = getParam("unassigned") === "true";
  const escalated = getParam("escalated") === "true";

  // Construct query parameters for GET /complaints (which backend automatically scopes to manager's department)
  const queryParams = React.useMemo<ComplaintListQuery>(() => {
    const params: ComplaintListQuery = {
      page,
      limit: 10,
    };

    if (q) params.q = q;

    if (unassigned) {
      params.status = "PENDING" as ComplaintStatus;
    } else if (statusParam && statusParam !== "ALL") {
      params.status = statusParam as ComplaintStatus;
    }

    if (priorityParam && priorityParam !== "ALL") {
      params.priority = priorityParam as Priority;
    }

    if (categoryIdParam && categoryIdParam !== "ALL") {
      params.categoryId = categoryIdParam;
    }

    // Sort mapping
    if (sortParam === "newest") {
      params.sortBy = "createdAt";
      params.sortOrder = "desc";
    } else if (sortParam === "priority") {
      params.sortBy = "priority";
      params.sortOrder = "desc";
    } else {
      // Default: SLA due soonest
      params.sortBy = "slaDueAt";
      params.sortOrder = "asc";
    }

    return params;
  }, [page, q, statusParam, priorityParam, categoryIdParam, sortParam, unassigned]);

  // Fetch queue data
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.complaints.list(queryParams),
    queryFn: () => complaintService.getMy(queryParams),
  });

  const departmentName =
    user?.department?.name || (user?.departmentId ? "Department" : "Municipal Operations");

  const hasActiveFilters =
    Boolean(q) ||
    Boolean(statusParam) ||
    Boolean(priorityParam) ||
    Boolean(categoryIdParam) ||
    sortParam !== "sla" ||
    escalated ||
    unassigned;

  const handleClearFilters = () => {
    const currentId = getParam("id");
    setParams({
      q: null,
      status: null,
      priority: null,
      categoryId: null,
      sort: null,
      unassigned: null,
      escalated: null,
      page: null,
    });
    if (currentId) setParam("id", currentId);
  };

  const handleSelectComplaint = (id: string) => {
    setParam("id", id);
  };

  const handleCloseSheet = (open: boolean) => {
    if (!open) {
      setParam("id", null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={`${departmentName} — Complaint queue`}
        description="Monitor triage assignments, supervise SLA countdowns, and dispatch field technicians for municipal tickets."
      />

      {/* 4 Stat Cards */}
      <QueueStats />

      {/* Filters Bar */}
      <QueueFilters />

      {/* Complaint Queue DataTable */}
      <QueueTable
        data={data}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        onSelectComplaint={handleSelectComplaint}
      />

      {/* Complaint Detail Sheet (opens when ?id= is in URL) */}
      <ComplaintSheet
        complaintId={complaintId}
        open={isSheetOpen}
        onOpenChange={handleCloseSheet}
      />
    </div>
  );
}
