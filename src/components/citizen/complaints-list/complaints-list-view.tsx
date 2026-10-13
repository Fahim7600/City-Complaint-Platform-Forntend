"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  FileQuestion,
  FilterX,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { EmptyState } from "@/components/shared/empty-state";
import { useUrlState } from "@/hooks/use-url-state";
import { complaintService } from "@/services/complaint.service";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import { formatRelativeTime } from "@/lib/format-date";
import { ComplaintStatus, type Complaint } from "@/types/complaint";

const STATUS_OPTIONS = [
  { label: "Pending", value: ComplaintStatus.PENDING },
  { label: "Assigned", value: ComplaintStatus.ASSIGNED },
  { label: "In Progress", value: ComplaintStatus.IN_PROGRESS },
  { label: "Resolved", value: ComplaintStatus.RESOLVED },
  { label: "Closed", value: ComplaintStatus.CLOSED },
  { label: "Rejected", value: ComplaintStatus.REJECTED },
  { label: "Cancelled", value: ComplaintStatus.CANCELLED },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Highest priority", value: "priority" },
];

export function ComplaintsListView() {
  const router = useRouter();
  const { getParam, getNumberParam, setParams } = useUrlState();

  // Read URL State
  const q = getParam("q", "").trim();
  const statusParam = getParam("status", "");
  const categoryIdParam = getParam("categoryId", "");
  const sortParam = getParam("sort", "newest");
  const page = getNumberParam("page", 1);
  const limit = getNumberParam("limit", 10);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    q ||
      statusParam ||
      categoryIdParam ||
      (sortParam && sortParam !== "newest")
  );

  // Fetch categories for the filter dropdown
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.publicList(),
    queryFn: publicService.getCategories,
  });

  const categoryOptions = React.useMemo(() => {
    return categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));
  }, [categories]);

  // Map sortParam to backend sortBy & sortOrder
  const { sortBy, sortOrder } = React.useMemo(() => {
    if (sortParam === "oldest") {
      return { sortBy: "createdAt" as const, sortOrder: "asc" as const };
    }
    if (sortParam === "priority") {
      return { sortBy: "priority" as const, sortOrder: "desc" as const };
    }
    return { sortBy: "createdAt" as const, sortOrder: "desc" as const };
  }, [sortParam]);

  // Data fetching: use search endpoint if q is present, otherwise getMy list endpoint
  const queryKey = q
    ? queryKeys.complaints.search({ q, page, limit })
    : queryKeys.complaints.list({
        page,
        limit,
        status: statusParam as ComplaintStatus || undefined,
        categoryId: categoryIdParam || undefined,
        sortBy,
        sortOrder,
      });

  const { data, isLoading, isError, error, refetch, isPlaceholderData } =
    useQuery({
      queryKey,
      queryFn: () => {
        if (q) {
          return complaintService.search({ q, page, limit });
        }
        return complaintService.getMy({
          page,
          limit,
          status: (statusParam as ComplaintStatus) || undefined,
          categoryId: categoryIdParam || undefined,
          sortBy,
          sortOrder,
        });
      },
      placeholderData: keepPreviousData,
    });

  React.useEffect(() => {
    if (isError) {
      toast.error("Failed to load complaints list.");
    }
  }, [isError]);

  const handleClearFilters = () => {
    setParams({
      q: null,
      status: null,
      categoryId: null,
      sort: null,
      page: 1,
    });
  };

  const columns: ColumnDef<Complaint>[] = [
    {
      key: "complaint",
      header: "Complaint",
      cell: (item) => (
        <div className="space-y-0.5">
          <p className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {item.title}
          </p>
          <span className="font-mono text-[11px] text-muted-foreground">
            #{item.id.slice(0, 8)}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (item) => (
        <span className="text-xs font-medium text-muted-foreground">
          {item.category?.name || "General"}
        </span>
      ),
    },
    {
      key: "department",
      header: "Department",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.department?.name || "Unassigned"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={item.status} size="sm" />
          {item.isEscalated && <StatusBadge isEscalated size="sm" />}
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (item) => <StatusBadge priority={item.priority} size="sm" />,
    },
    {
      key: "created",
      header: "Created",
      cell: (item) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatRelativeTime(item.createdAt)}
        </span>
      ),
    },
  ];

  const total =
    data?.total ??
    (data as unknown as { meta?: { total?: number } })?.meta?.total ??
    0;
  const totalPages =
    data?.totalPages ??
    (data as unknown as { meta?: { totalPages?: number } })?.meta?.totalPages ??
    1;

  const paginationMeta = {
    page: data?.page ?? page,
    limit: data?.limit ?? limit,
    total,
    totalPages,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="My Complaints"
        description="Browse, filter, and track all municipal complaints filed by your account."
        actions={
          <Link href="/dashboard/complaints/new">
            <Button
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all duration-300 hover:scale-[1.02]"
            >
              <Plus className="size-4 mr-2" />
              New complaint
            </Button>
          </Link>
        }
      />

      {/* Filters Bar: ALL synced to URL */}
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 flex-1">
            {/* Search Input (q) */}
            <SearchInput
              paramKey="q"
              placeholder="Search by title, location..."
              debounceMs={400}
              className="w-full sm:w-64"
            />

            {/* Status Filter */}
            <FilterSelect
              paramKey="status"
              options={STATUS_OPTIONS}
              placeholder="All Statuses"
              allLabel="All Statuses"
              className="w-full sm:w-36"
            />

            {/* Category Filter */}
            <FilterSelect
              paramKey="categoryId"
              options={categoryOptions}
              placeholder="All Categories"
              allLabel="All Categories"
              className="w-full sm:w-44"
            />

            {/* Sort Select */}
            <FilterSelect
              paramKey="sort"
              options={SORT_OPTIONS}
              placeholder="Sort by"
              defaultValue="newest"
              allLabel=""
              className="w-full sm:w-36"
            />
          </div>

          {/* Clear Filters ghost button: appears ONLY when any filter is active */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground shrink-0 self-start lg:self-center"
            >
              <FilterX className="size-3.5 mr-1.5" />
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {/* Error Retry banner */}
      {isError && (
        <Card className="border border-destructive/30 bg-destructive/5 p-4 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-destructive font-medium">
            {error instanceof Error ? error.message : "Error loading complaints"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs h-8"
          >
            <RefreshCw className="size-3 mr-1.5" />
            Retry
          </Button>
        </Card>
      )}

      {/* Data Table with keepPreviousData */}
      <div className={isPlaceholderData ? "opacity-60 transition-opacity" : ""}>
        <DataTable<Complaint>
          columns={columns}
          data={data?.items || []}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          onRowClick={(item) => router.push(`/dashboard/complaints/${item.id}`)}
          emptyState={
            hasActiveFilters ? (
              <EmptyState
                icon={Search}
                title="No complaints match your filters"
                description="Try adjusting or clearing your search term, status, or category filters."
                action={{
                  label: "Clear filters",
                  onClick: handleClearFilters,
                  variant: "outline",
                }}
              />
            ) : (
              <EmptyState
                icon={FileQuestion}
                title="You haven't filed any complaints yet"
                description="Once you report an issue, it will appear here with live tracking, technician updates, and resolution logs."
                action={{
                  label: "File your first complaint",
                  href: "/dashboard/complaints/new",
                  icon: Plus,
                }}
              />
            )
          }
        />
      </div>

      {/* Pagination Controls */}
      <PaginationControls meta={paginationMeta} showTotal={true} />
    </div>
  );
}
