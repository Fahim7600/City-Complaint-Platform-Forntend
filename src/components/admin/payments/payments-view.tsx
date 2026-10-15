"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  Download,
  FilterX,
  RefreshCw,
  ShieldAlert,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button } from "@/components/ui/button";
import { PaymentsTable } from "./payments-table";
import { PaymentDetailSheet, type SubscriptionRecord } from "./payment-detail-sheet";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useUrlState } from "@/hooks/use-url-state";
import type { SubscriptionStatus } from "@/types/payment";

const PaymentsChart = dynamic(
  () => import("./payments-chart").then((mod) => mod.PaymentsChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-2xl border border-border/50 bg-card/40 animate-pulse" />
    ),
  }
);

const PAGE_LIMIT = 10;

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Canceled", value: "CANCELED" },
  { label: "Past Due", value: "PAST_DUE" },
  { label: "Incomplete", value: "INCOMPLETE" },
];

export function PaymentsView() {
  const { getParam, getNumberParam, setParam, setParams } = useUrlState();

  const status = getParam("status", "");
  const q = getParam("q", "");
  const selectedRecordId = getParam("id", "");
  const currentPage = getNumberParam("page", 1);

  // 1. Fetch payments / subscriptions from Admin endpoint
  const {
    data: paymentsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.payments.list({
      status: status ? (status as SubscriptionStatus) : undefined,
      page: currentPage,
      limit: PAGE_LIMIT,
    }),
    queryFn: () =>
      adminService.getPayments({
        status: status ? (status as SubscriptionStatus) : undefined,
        page: currentPage,
        limit: PAGE_LIMIT,
      }),
  });

  // 2. Fetch dashboard stats for total revenue
  const { data: dashboardStats } = useQuery({
    queryKey: queryKeys.admin.dashboardStats(),
    queryFn: () => adminService.getDashboardStats(),
  });

  const rawRecords = React.useMemo<SubscriptionRecord[]>(() => {
    return (paymentsData?.items as unknown as SubscriptionRecord[]) || [];
  }, [paymentsData?.items]);

  // Client search filter by citizen name or email
  const displayedRecords = React.useMemo(() => {
    if (!q.trim()) return rawRecords;
    const query = q.toLowerCase().trim();
    return rawRecords.filter(
      (r) =>
        r.user?.name?.toLowerCase().includes(query) ||
        r.user?.email?.toLowerCase().includes(query)
    );
  }, [rawRecords, q]);

  const selectedRecord = React.useMemo(() => {
    if (!selectedRecordId) return null;
    return displayedRecords.find((r) => r.id === selectedRecordId) || null;
  }, [displayedRecords, selectedRecordId]);

  const totalRevenue = (dashboardStats?.revenue?.totalCents || 0) / 100;
  const totalPages = paymentsData?.totalPages || 1;
  const totalCount = paymentsData?.total || 0;

  // Compute monthly revenue trend points from real payment dates
  const monthlyRevenueData = React.useMemo(() => {
    const monthsMap = new Map<string, { revenue: number; count: number }>();

    rawRecords.forEach((sub) => {
      sub.payments?.forEach((p) => {
        if (p.createdAt) {
          const date = new Date(p.createdAt);
          const monthKey = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          const rawAmount = p.amount > 100 ? p.amount / 100 : p.amount;
          const current = monthsMap.get(monthKey) || { revenue: 0, count: 0 };
          monthsMap.set(monthKey, {
            revenue: current.revenue + rawAmount,
            count: current.count + 1,
          });
        }
      });
    });

    return Array.from(monthsMap.entries()).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue * 100) / 100,
      count: data.count,
    }));
  }, [rawRecords]);

  // Compute stat counts from current dataset
  const activeSubsCount = rawRecords.filter((r) => r.status === "ACTIVE").length;
  const pastDueCount = rawRecords.filter((r) => r.status === "PAST_DUE").length;

  // Export CSV
  const handleExportCSV = () => {
    if (displayedRecords.length === 0) {
      toast.error("No payment records to export.");
      return;
    }

    const headers = [
      "Subscription ID",
      "Date",
      "Citizen Name",
      "Citizen Email",
      "Status",
      "Latest Amount",
      "Currency",
      "Total Invoices",
    ];

    const rows = displayedRecords.map((r) => {
      const latestPayment = r.payments?.[0];
      const amt = latestPayment?.amount
        ? latestPayment.amount > 100
          ? latestPayment.amount / 100
          : latestPayment.amount
        : 0;

      return [
        `"${r.id}"`,
        `"${r.createdAt}"`,
        `"${r.user?.name || ""}"`,
        `"${r.user?.email || ""}"`,
        `"${r.status}"`,
        `"${amt.toFixed(2)}"`,
        `"${latestPayment?.currency?.toUpperCase() || "USD"}"`,
        `"${r.payments?.length || 0}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute("download", `payments-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${displayedRecords.length} payment records`);
  };

  const hasActiveFilters = Boolean(q.trim() || status);

  const handleClearFilters = () => {
    setParams({
      q: undefined,
      status: undefined,
      page: 1,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header with Export CSV action */}
      <PageHeader
        title="Payment & Subscription History"
        description="Comprehensive audit of citizen premium membership subscriptions, Stripe payment intents, and recurring civic revenue."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        }
      />

      {/* 2. Real StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Municipal Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          description="Cumulative Stripe subscription volume"
          icon={DollarSign}
          iconColor="primary"
        />

        <StatCard
          label="Active Subscriptions"
          value={activeSubsCount}
          description="Currently active recurring citizens"
          icon={Users}
          iconColor="violet"
        />

        <StatCard
          label="Past Due Invoices"
          value={pastDueCount}
          description="Subscriptions pending payment recovery"
          icon={ShieldAlert}
          iconColor="amber"
        />

        <StatCard
          label="Total Tracked Records"
          value={totalCount}
          description="Subscription lifecycles in database"
          icon={CreditCard}
          iconColor="blue"
        />
      </div>

      {/* 3. Monthly Revenue Trend Chart */}
      <PaymentsChart data={monthlyRevenueData} />

      {/* 4. Filters & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px] max-w-xl">
          <div className="flex-1 min-w-[200px]">
            <SearchInput
              defaultValue={q}
              placeholder="Search subscribers by name or email..."
              className="h-9 text-xs"
            />
          </div>

          <FilterSelect
            paramKey="status"
            options={STATUS_OPTIONS}
            placeholder="Filter by status"
            allLabel="All Statuses"
            className="w-44 text-xs"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-destructive h-9 px-2.5 gap-1.5"
          >
            <FilterX className="size-3.5" />
            <span>Clear filters</span>
          </Button>
        )}
      </div>

      {/* 5. Payments Table or Error */}
      {isError ? (
        <div className="py-20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="font-semibold text-foreground text-sm">
            Failed to load payment records
          </p>
          <button
            onClick={() => refetch()}
            className="text-xs text-violet-500 hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="size-3" /> Retry query
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <PaymentsTable
            records={displayedRecords}
            isLoading={isLoading}
            onSelectRecord={(r) => setParam("id", r.id)}
            emptyState={
              <EmptyState
                icon={CreditCard}
                title={hasActiveFilters ? "No payments match your filters" : "No payment records found"}
                description={
                  hasActiveFilters
                    ? "Try clearing your status filter or adjusting your citizen search query."
                    : "Citizen subscription transactions processed through Stripe will appear here."
                }
                action={
                  hasActiveFilters
                    ? {
                        label: "Clear filters",
                        onClick: handleClearFilters,
                      }
                    : undefined
                }
              />
            }
          />

          {/* 6. Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              meta={{
                page: currentPage,
                totalPages,
                total: totalCount,
                limit: PAGE_LIMIT,
              }}
            />
          )}
        </div>
      )}

      {/* Detail Sheet */}
      <PaymentDetailSheet
        record={selectedRecord}
        open={Boolean(selectedRecord)}
        onOpenChange={(open) => {
          if (!open) setParam("id", null);
        }}
      />
    </div>
  );
}
