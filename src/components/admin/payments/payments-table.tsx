"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Crown,
  Mail,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import type { SubscriptionRecord } from "./payment-detail-sheet";

interface PaymentsTableProps {
  records: SubscriptionRecord[];
  isLoading: boolean;
  onSelectRecord: (record: SubscriptionRecord) => void;
  emptyState?: React.ReactNode;
}

export function PaymentsTable({
  records,
  isLoading,
  onSelectRecord,
  emptyState,
}: PaymentsTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Reference copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: ColumnDef<SubscriptionRecord>[] = React.useMemo(
    () => [
      {
        key: "createdAt",
        header: "Date",
        cell: (item) => (
          <span className="text-xs text-muted-foreground font-mono">
            {formatDate(item.createdAt)}
          </span>
        ),
      },
      {
        key: "citizen",
        header: "Citizen Subscriber",
        cell: (item) => (
          <div className="space-y-0.5 min-w-0">
            <span className="font-bold text-xs text-foreground block truncate">
              {item.user?.name || "Citizen"}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Mail className="size-2.5" />
              {item.user?.email || "—"}
            </span>
          </div>
        ),
      },
      {
        key: "amount",
        header: "Amount & Plan",
        cell: (item) => {
          const latestPayment = item.payments?.[0];
          const rawAmount = latestPayment?.amount ?? 999;
          const displayAmount =
            rawAmount > 100 ? (rawAmount / 100).toFixed(2) : Number(rawAmount).toFixed(2);
          const currency = (latestPayment?.currency || "usd").toUpperCase();

          return (
            <div className="space-y-0.5">
              <span className="font-mono font-bold text-xs text-foreground">
                ${displayAmount} {currency}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {item.payments?.length || 0} charge invoice(s)
              </span>
            </div>
          );
        },
      },
      {
        key: "purpose",
        header: "Purpose",
        cell: () => (
          <Badge
            variant="outline"
            className="text-[11px] font-semibold border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 gap-1"
          >
            <Crown className="size-2.5" />
            Premium Citizen
          </Badge>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (item) => {
          switch (item.status) {
            case "ACTIVE":
              return (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold gap-1">
                  <CheckCircle2 className="size-2.5" />
                  Active
                </Badge>
              );
            case "CANCELED":
              return (
                <Badge variant="destructive" className="text-[11px] font-bold gap-1">
                  <XCircle className="size-2.5" />
                  Canceled
                </Badge>
              );
            case "PAST_DUE":
              return (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold gap-1">
                  <ShieldAlert className="size-2.5" />
                  Past Due
                </Badge>
              );
            default:
              return (
                <Badge variant="outline" className="text-[11px] font-bold gap-1 text-muted-foreground">
                  <Clock className="size-2.5" />
                  {item.status}
                </Badge>
              );
          }
        },
      },
      {
        key: "reference",
        header: "Stripe Ref",
        cell: (item) => {
          const shortRef = item.id.length > 10 ? `${item.id.slice(0, 8)}••••` : item.id;
          return (
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-muted-foreground">{shortRef}</span>
              <button
                type="button"
                onClick={(e) => handleCopy(e, item.id)}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                aria-label="Copy reference"
              >
                {copiedId === item.id ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        key: "actions",
        header: <span className="sr-only">Details</span>,
        className: "text-right w-10",
        cell: () => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <DataTable
      columns={columns}
      data={records}
      keyExtractor={(item) => item.id}
      onRowClick={onSelectRecord}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}
