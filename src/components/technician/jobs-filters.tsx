"use client";

import * as React from "react";
import { Filter, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { useUrlState } from "@/hooks/use-url-state";
import { Priority } from "@/types/complaint";
import { cn } from "@/lib/utils";

interface JobsFiltersProps {
  counts?: {
    active: number;
    resolved: number;
    all: number;
  };
}

export function JobsFilters({ counts }: JobsFiltersProps) {
  const { getParam, setParam, setParams } = useUrlState();

  const currentTab = getParam("tab", "active");
  const searchQuery = getParam("q", "");
  const priorityFilter = getParam("priority", "");
  const sortOption = getParam("sort", "sla");

  const hasActiveFilters = Boolean(searchQuery || priorityFilter || (sortOption && sortOption !== "sla") || currentTab !== "active");

  const handleTabChange = (tab: "active" | "resolved" | "all") => {
    setParam("tab", tab === "active" ? null : tab, { resetPage: true });
  };

  const handleClearAll = () => {
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

  return (
    <div className="space-y-4">
      {/* URL-synced Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border/60">
          <button
            type="button"
            onClick={() => handleTabChange("active")}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5",
              currentTab === "active"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <span>Active Jobs</span>
            {counts && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  currentTab === "active"
                    ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 font-bold"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts.active}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("resolved")}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5",
              currentTab === "resolved"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <span>Resolved</span>
            {counts && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  currentTab === "resolved"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts.resolved}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5",
              currentTab === "all"
                ? "bg-background text-foreground shadow-sm font-bold border border-border/80"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <span>All History</span>
            {counts && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  currentTab === "all"
                    ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts.all}
              </span>
            )}
          </button>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
          >
            <RotateCcw className="size-3 mr-1" />
            Reset filters
          </Button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            paramKey="q"
            placeholder="Search by title, description or location..."
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <FilterSelect
            paramKey="priority"
            placeholder="Priority"
            allLabel="All Priorities"
            options={[
              { label: "High Priority", value: Priority.HIGH },
              { label: "Medium Priority", value: Priority.MEDIUM },
              { label: "Low Priority", value: Priority.LOW },
            ]}
          />

          {/* Sort Selection */}
          <FilterSelect
            paramKey="sort"
            placeholder="Sort by"
            allLabel=""
            defaultValue="sla"
            options={[
              { label: "SLA due soonest", value: "sla" },
              { label: "Newest assigned", value: "newest" },
              { label: "Highest priority", value: "priority" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
