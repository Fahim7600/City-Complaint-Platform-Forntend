"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Layers,
  RotateCcw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useDebounce } from "@/hooks/use-debounce";
import { ComplaintStatus, Priority } from "@/types/complaint";

interface ComplaintsFiltersProps {
  tab: string;
  onTabChange: (tab: string) => void;
  q: string;
  onQChange: (q: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  departmentId: string;
  onDepartmentChange: (deptId: string) => void;
  categoryId: string;
  onCategoryChange: (catId: string) => void;
  sort: string;
  onSortChange: (sort: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  escalatedCount?: number;
}

export function ComplaintsFilters({
  tab,
  onTabChange,
  q,
  onQChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  departmentId,
  onDepartmentChange,
  categoryId,
  onCategoryChange,
  sort,
  onSortChange,
  onClear,
  hasActiveFilters,
  escalatedCount = 0,
}: ComplaintsFiltersProps) {
  const [localQ, setLocalQ] = React.useState(q);
  const debouncedQ = useDebounce(localQ, 350);

  React.useEffect(() => {
    onQChange(debouncedQ);
  }, [debouncedQ, onQChange]);

  const handleClear = () => {
    setLocalQ("");
    onClear();
  };

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: queryKeys.departments.list(),
    queryFn: () => adminService.getDepartments(),
  });

  // Fetch categories of selected department (if selected)
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.byDepartment(departmentId),
    queryFn: () => adminService.getCategories(departmentId),
    enabled: Boolean(departmentId),
  });

  return (
    <div className="space-y-4">
      {/* 1. Main Tabs: All, Escalated, Overdue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-3">
        <Tabs value={tab} onValueChange={onTabChange} className="w-full sm:w-auto">
          <TabsList className="bg-muted/60 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Layers className="size-3.5 mr-1.5" />
              All Tickets
            </TabsTrigger>

            <TabsTrigger
              value="escalated"
              className="text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-rose-500 data-[state=active]:shadow-sm"
            >
              <ShieldAlert className="size-3.5 mr-1.5 text-rose-500" />
              Escalated
              {escalatedCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 px-1.5 py-0 h-4 min-w-4 text-[10px] font-extrabold rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                >
                  {escalatedCount}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="overdue"
              className="text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-amber-500 data-[state=active]:shadow-sm"
            >
              <Clock className="size-3.5 mr-1.5 text-amber-500" />
              Overdue SLA
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 text-xs text-muted-foreground hover:text-foreground self-start sm:self-auto"
          >
            <RotateCcw className="size-3 mr-1.5" />
            Clear filters
          </Button>
        )}
      </div>

      {/* 2. Secondary Filter Bar */}
      <div className="p-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Search title, description..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Priority Filter */}
        <Select
          value={priority || "ALL"}
          onValueChange={(val) => onPriorityChange(!val || val === "ALL" ? "" : val)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              All Priorities
            </SelectItem>
            <SelectItem value={Priority.HIGH} className="text-xs">
              High Priority
            </SelectItem>
            <SelectItem value={Priority.MEDIUM} className="text-xs">
              Medium Priority
            </SelectItem>
            <SelectItem value={Priority.LOW} className="text-xs">
              Low Priority
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter (applicable for all tab) */}
        {tab === "all" ? (
          <Select
            value={status || "ALL"}
            onValueChange={(val) => onStatusChange(!val || val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Statuses
              </SelectItem>
              <SelectItem value={ComplaintStatus.PENDING} className="text-xs">
                Pending Triage
              </SelectItem>
              <SelectItem value={ComplaintStatus.ASSIGNED} className="text-xs">
                Assigned
              </SelectItem>
              <SelectItem value={ComplaintStatus.IN_PROGRESS} className="text-xs">
                In Progress
              </SelectItem>
              <SelectItem value={ComplaintStatus.RESOLVED} className="text-xs">
                Resolved
              </SelectItem>
              <SelectItem value={ComplaintStatus.CLOSED} className="text-xs">
                Closed
              </SelectItem>
              <SelectItem value={ComplaintStatus.REJECTED} className="text-xs">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="h-9 px-3 rounded-lg border border-border/40 bg-muted/20 flex items-center text-xs text-muted-foreground font-medium">
            Status: {tab.toUpperCase()}
          </div>
        )}

        {/* Department Filter */}
        <Select
          value={departmentId || "ALL"}
          onValueChange={(val) => {
            onDepartmentChange(!val || val === "ALL" ? "" : val);
            onCategoryChange("");
          }}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-xs">
              All Departments
            </SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id} className="text-xs">
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter (if dept selected) */}
        {departmentId ? (
          <Select
            value={categoryId || "ALL"}
            onValueChange={(val) => onCategoryChange(!val || val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="text-xs">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          /* Sort Select */
          <Select
            value={sort || "newest"}
            onValueChange={(val) => onSortChange(val || "newest")}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs">
                Newest First
              </SelectItem>
              <SelectItem value="sla" className="text-xs">
                SLA Due Soonest
              </SelectItem>
              <SelectItem value="priority" className="text-xs">
                Highest Priority
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
