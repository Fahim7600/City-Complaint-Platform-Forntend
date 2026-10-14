"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ClipboardList,
  Info,
  RotateCcw,
  UserCheck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { EmptyState } from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { TeamCard } from "./team-card";
import { TeamSheet } from "./team-sheet";
import { departmentService } from "@/services/department.service";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import { useAuth } from "@/hooks/use-auth";
import type { DepartmentTechnician } from "@/types/department";
import { cn } from "@/lib/utils";

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available Only" },
  { value: "unavailable", label: "On Leave" },
];

export function TeamView() {
  const { user } = useAuth();
  const { getParam, setParams } = useUrlState();

  const [selectedTech, setSelectedTech] =
    React.useState<DepartmentTechnician | null>(null);

  const q = getParam("q", "");
  const availability = getParam("availability");

  const departmentId = user?.departmentId || "";

  // 1. Fetch technicians in this department
  const { data: technicians = [], isLoading: isTechsLoading } = useQuery({
    queryKey: queryKeys.departments.technicians(departmentId),
    queryFn: () => departmentService.getMyTechnicians(departmentId),
    enabled: Boolean(departmentId),
  });

  // 2. Fetch department complaints to cross-reference technician workloads
  const { data: complaintsData, isLoading: isComplaintsLoading } = useQuery({
    queryKey: queryKeys.complaints.list({ limit: 50 }),
    queryFn: () => complaintService.getMy({ limit: 50 }),
    enabled: Boolean(departmentId),
  });

  const departmentComplaints = complaintsData?.items || [];

  // Filter technicians by search query & availability
  const filteredTechnicians = React.useMemo(() => {
    return technicians.filter((tech) => {
      if (q.trim()) {
        const matchesName = tech.name
          .toLowerCase()
          .includes(q.toLowerCase().trim());
        if (!matchesName) return false;
      }

      if (availability === "available" && !tech.isAvailable) {
        return false;
      }
      if (availability === "unavailable" && tech.isAvailable) {
        return false;
      }

      return true;
    });
  }, [technicians, q, availability]);

  const hasActiveFilters = Boolean(q) || Boolean(availability);

  const handleClearFilters = () => {
    setParams({ q: null, availability: null });
  };

  const departmentName =
    user?.department?.name || (departmentId ? "Department" : "Municipal Operations");

  const isLoading = isTechsLoading || isComplaintsLoading;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={`${departmentName} — Field Team`}
        description="Oversee technician dispatch availability, current job workloads, and customer resolution ratings."
      />

      {/* Info Notice: Technicians join through applications */}
      <div className="p-4 rounded-2xl border border-border/70 bg-gradient-to-r from-violet-500/10 via-background to-card/70 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5 text-muted-foreground">
          <Info className="size-4 text-violet-500 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            New technicians join through staff applications. Review candidates to expand your department roster.
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
            placeholder="Search technicians by name..."
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
              <Link
                href="/manager/applications"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "text-xs font-semibold"
                )}
              >
                <UserCheck className="size-3.5 mr-1.5" />
                Review Technician Applications
              </Link>
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
    </div>
  );
}
