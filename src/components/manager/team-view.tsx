"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios, { type AxiosError } from "axios";
import {
  ArrowRight,
  ClipboardList,
  Info,
  RotateCcw,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { TeamCard } from "./team-card";
import { TeamSheet } from "./team-sheet";
import { InviteTechnicianDialog } from "./invite-technician-dialog";
import { BlockingComplaintsDialog } from "./blocking-complaints-dialog";
import { departmentService } from "@/services/department.service";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { useUrlState } from "@/hooks/use-url-state";
import { useAuth } from "@/hooks/use-auth";
import type { DepartmentTechnician } from "@/types/department";
import type { ApiResponse } from "@/types/api";
import { cn } from "@/lib/utils";

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available Only" },
  { value: "unavailable", label: "On Leave" },
  { value: "pending", label: "Invite Pending" },
];

export function TeamView() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { getParam, setParams } = useUrlState();

  const [selectedTech, setSelectedTech] =
    React.useState<DepartmentTechnician | null>(null);

  // Dialog states
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [removeConfirmTech, setRemoveConfirmTech] =
    React.useState<DepartmentTechnician | null>(null);
  const [blockingData, setBlockingData] = React.useState<{
    technicianName: string;
    complaintIds: string[];
  } | null>(null);

  const q = getParam("q", "");
  const availability = getParam("availability");

  const departmentId = user?.departmentId || "";
  const departmentName =
    user?.department?.name || (departmentId ? "Department" : "Municipal Operations");

  // 1. Fetch technicians for manager's department
  const {
    data: technicians = [],
    isLoading: isTechsLoading,
  } = useQuery({
    queryKey: queryKeys.departments.myTechnicians(),
    queryFn: () => departmentService.getMyDepartmentTechnicians(),
    enabled: Boolean(departmentId),
  });

  // 2. Fetch department complaints to cross-reference workloads & titles
  const { data: complaintsData, isLoading: isComplaintsLoading } = useQuery({
    queryKey: queryKeys.complaints.list({ limit: 100 }),
    queryFn: () => complaintService.getMy({ limit: 100 }),
    enabled: Boolean(departmentId),
  });

  const departmentComplaints = complaintsData?.items || [];

  // Invalidate helper for invite / remove / resend
  const invalidateAllRosters = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.departments.myTechnicians(),
    });
    if (departmentId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.technicians(departmentId),
      });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    queryClient.invalidateQueries({
      queryKey: queryKeys.admin.dashboardStats(),
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.public.all });
  }, [queryClient, departmentId]);

  // Resend Invite Mutation
  const resendInviteMutation = useMutation({
    mutationFn: (tech: DepartmentTechnician) =>
      departmentService.resendInvite(tech.id),
    onSuccess: (_, tech) => {
      toast.success(`New invitation sent to ${tech.email || tech.name}`);
      invalidateAllRosters();
    },
    onError: (err) => {
      const msg = getErrorMessage(err);
      toast.error(msg);
    },
  });

  // Remove Technician Mutation with optimistic update and rollback
  const removeTechnicianMutation = useMutation({
    mutationFn: (technicianId: string) =>
      departmentService.removeTechnician(technicianId),
    onMutate: async (technicianId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.departments.myTechnicians(),
      });

      // Snapshot previous value
      const previousTechs = queryClient.getQueryData<DepartmentTechnician[]>(
        queryKeys.departments.myTechnicians()
      );

      // Optimistically remove the technician
      if (previousTechs) {
        queryClient.setQueryData<DepartmentTechnician[]>(
          queryKeys.departments.myTechnicians(),
          previousTechs.filter((t) => t.id !== technicianId)
        );
      }

      return { previousTechs };
    },
    onError: (err: unknown, technicianId, context) => {
      // Rollback optimistic update
      if (context?.previousTechs) {
        queryClient.setQueryData(
          queryKeys.departments.myTechnicians(),
          context.previousTechs
        );
      }

      // Check if 409 with blocking complaints
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<
          ApiResponse<{ blockingComplaintIds?: string[] }>
        >;
        if (
          axiosErr.response?.status === 409 &&
          axiosErr.response?.data?.data?.blockingComplaintIds
        ) {
          const ids = axiosErr.response.data.data.blockingComplaintIds;
          const target = (context?.previousTechs || technicians).find(
            (t) => t.id === technicianId
          );
          setBlockingData({
            technicianName: target?.name || "Technician",
            complaintIds: ids,
          });
          return;
        }
      }

      const msg = getErrorMessage(err);
      toast.error(msg);
    },
    onSuccess: (_, technicianId, context) => {
      const target = (context?.previousTechs || technicians).find(
        (t) => t.id === technicianId
      );
      toast.success(`${target?.name || "Technician"} removed from the team`);
    },
    onSettled: () => {
      invalidateAllRosters();
    },
  });

  // Filter technicians by search query & availability
  const filteredTechnicians = React.useMemo(() => {
    return technicians.filter((tech) => {
      if (q.trim()) {
        const matchesName = tech.name
          .toLowerCase()
          .includes(q.toLowerCase().trim());
        const matchesEmail = tech.email
          ?.toLowerCase()
          .includes(q.toLowerCase().trim());
        if (!matchesName && !matchesEmail) return false;
      }

      if (availability === "available" && !tech.isAvailable) {
        return false;
      }
      if (availability === "unavailable" && tech.isAvailable) {
        return false;
      }
      if (
        availability === "pending" &&
        !(tech.invitePending || tech.mustChangePassword)
      ) {
        return false;
      }

      return true;
    });
  }, [technicians, q, availability]);

  const hasActiveFilters = Boolean(q) || Boolean(availability);

  const handleClearFilters = () => {
    setParams({ q: null, availability: null });
  };

  const isLoading = isTechsLoading || isComplaintsLoading;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={`${departmentName} — Field Team`}
        description="Oversee technician dispatch availability, current job workloads, and customer resolution ratings."
        actions={
          <Button
            variant="neon"
            size="sm"
            onClick={() => setInviteOpen(true)}
            className="text-xs font-semibold gap-1.5"
          >
            <UserPlus className="size-4" />
            <span>Add technician</span>
          </Button>
        }
      />

      {/* Info Notice: Add technicians directly by email, or approve staff applications */}
      <div className="p-4 rounded-2xl border border-border/70 bg-gradient-to-r from-violet-500/10 via-background to-card/70 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5 text-muted-foreground">
          <Info className="size-4 text-violet-500 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            Add technicians directly by email, or approve staff applications.
          </span>
        </div>

        <Link
          href="/manager/applications"
          className="inline-flex items-center gap-1.5 font-bold text-violet-600 dark:text-violet-400 hover:underline shrink-0 self-start sm:self-auto"
        >
          <ClipboardList className="size-3.5" />
          Review Staff Applications
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm">
        <div className="flex-1">
          <SearchInput
            value={q}
            onChange={(val) => setParams({ q: val || null })}
            placeholder="Search technicians by name or email..."
          />
        </div>

        <div className="w-full sm:w-56">
          <FilterSelect
            paramKey="availability"
            options={AVAILABILITY_OPTIONS}
            placeholder="Availability"
            allLabel="All Technicians"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground h-9 px-2.5"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Team Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="h-56 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
          <div className="h-56 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
          <div className="h-56 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
        </div>
      ) : filteredTechnicians.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={Users}
            title="No matching technicians"
            description="No team members match your active search and availability filters."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No technicians in this department"
            description="There are currently no active field technicians assigned to this department."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="neon"
                  size="sm"
                  onClick={() => setInviteOpen(true)}
                  className="text-xs font-semibold gap-1.5"
                >
                  <UserPlus className="size-3.5" />
                  Add Technician
                </Button>
                <Link
                  href="/manager/applications"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "text-xs font-semibold"
                  )}
                >
                  <UserCheck className="size-3.5 mr-1.5" />
                  Review Applications
                </Link>
              </div>
            }
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTechnicians.map((tech) => (
            <TeamCard
              key={tech.id}
              technician={tech}
              departmentComplaints={departmentComplaints}
              onClick={() => setSelectedTech(tech)}
              onResendInvite={(t) => resendInviteMutation.mutate(t)}
              isResending={resendInviteMutation.isPending}
              onRemove={(t) => setRemoveConfirmTech(t)}
            />
          ))}
        </div>
      )}

      {/* Technician Detail Sheet */}
      <TeamSheet
        technician={selectedTech}
        open={Boolean(selectedTech)}
        onOpenChange={(open) => {
          if (!open) setSelectedTech(null);
        }}
        departmentComplaints={departmentComplaints}
      />

      {/* Invite Technician Dialog */}
      <InviteTechnicianDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        departmentName={departmentName}
        departmentId={departmentId}
      />

      {/* Confirm Technician Removal Dialog */}
      <ConfirmDialog
        open={Boolean(removeConfirmTech)}
        onOpenChange={(open) => {
          if (!open) setRemoveConfirmTech(null);
        }}
        title={`Remove ${removeConfirmTech?.name || "Technician"}?`}
        description={`${removeConfirmTech?.name || "This technician"} will be removed from ${departmentName} and become a regular citizen. They will be signed out.`}
        confirmText="Remove from team"
        variant="destructive"
        isLoading={removeTechnicianMutation.isPending}
        onConfirm={() => {
          if (removeConfirmTech) {
            const id = removeConfirmTech.id;
            setRemoveConfirmTech(null);
            removeTechnicianMutation.mutate(id);
          }
        }}
      />

      {/* 409 Blocking Active Complaints Dialog */}
      <BlockingComplaintsDialog
        open={Boolean(blockingData)}
        onOpenChange={(open) => {
          if (!open) setBlockingData(null);
        }}
        technicianName={blockingData?.technicianName || "Technician"}
        blockingComplaintIds={blockingData?.complaintIds || []}
        departmentComplaints={departmentComplaints}
      />
    </div>
  );
}
