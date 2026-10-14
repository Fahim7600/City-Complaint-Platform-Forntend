"use client";

import * as React from "react";
import { Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useUrlState } from "@/hooks/use-url-state";
import { formatDate } from "@/lib/format-date";
import {
  PaymentStatus,
  type Payment,
} from "@/types/payment";

interface PaymentHistoryTableProps {
  payments?: Payment[];
}

export function PaymentHistoryTable({ payments = [] }: PaymentHistoryTableProps) {
  const { getParam } = useUrlState();
  const page = Number(getParam("page", "1")) || 1;
  const limit = 5;

  const totalPages = Math.max(1, Math.ceil(payments.length / limit));
  const paginatedPayments = payments.slice((page - 1) * limit, page * limit);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCEEDED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Succeeded
          </span>
        );
      case PaymentStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case PaymentStatus.FAILED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Failed
          </span>
        );
      case PaymentStatus.REFUNDED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <span className="size-1.5 rounded-full bg-sky-500" />
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
            {status}
          </span>
        );
    }
  };

  const columns: ColumnDef<Payment>[] = [
    {
      key: "date",
      header: "Date",
      cell: (p: Payment) => (
        <span className="font-medium text-foreground text-xs">
          {formatDate(p.createdAt)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (p: Payment) => {
        const amt = p.amount > 100 ? (p.amount / 100).toFixed(2) : p.amount.toFixed(2);
        return (
          <span className="font-mono font-bold text-xs text-foreground">
            {p.currency?.toUpperCase()} ${amt}
          </span>
        );
      },
    },
    {
      key: "purpose",
      header: "Purpose",
      cell: (p: Payment) => (
        <span className="text-xs text-muted-foreground capitalize">
          {p.purpose?.toLowerCase().replace(/_/g, " ") || "Subscription"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p: Payment) => getStatusBadge(p.status),
    },
  ];

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-violet-500" />
            <h3 className="font-heading text-sm font-semibold text-foreground">
              Billing & Payment History
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-semibold">
            {payments.length} transactions
          </span>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            description="You haven't made any subscription payments yet. Upgrading to Premium will record your Stripe receipts here."
          />
        ) : (
          <div className="space-y-4">
            <DataTable
              columns={columns}
              data={paginatedPayments}
              keyExtractor={(item) => item.id}
            />
            {totalPages > 1 && (
              <PaginationControls
                meta={{
                  page,
                  limit,
                  total: payments.length,
                  totalPages,
                }}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
