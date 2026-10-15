"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/format-date";
import type { AuditLog } from "@/types/audit-log";

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onSelectLog: (log: AuditLog) => void;
  emptyState?: React.ReactNode;
}

export function AuditLogsTable({
  logs,
  isLoading,
  onSelectLog,
  emptyState,
}: AuditLogsTableProps) {
  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("APPROVED")) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
          {action}
        </Badge>
      );
    }
    if (act.includes("DELETE") || act.includes("DEACTIVATE") || act.includes("REJECT")) {
      return (
        <Badge variant="destructive" className="text-[10px] font-bold">
          {action}
        </Badge>
      );
    }
    if (act.includes("ROLE")) {
      return (
        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
          {action}
        </Badge>
      );
    }
    if (act.includes("STATUS") || act.includes("ESCALAT")) {
      return (
        <Badge className="bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30 text-[10px] font-bold">
          {action}
        </Badge>
      );
    }
    return (
      <Badge className="bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[10px] font-bold">
        {action}
      </Badge>
    );
  };

  const getEntityLink = (entityType: string, entityId: string) => {
    switch (entityType.toLowerCase()) {
      case "complaint":
        return `/admin/complaints?id=${entityId}`;
      case "user":
        return `/admin/users?id=${entityId}`;
      case "department":
        return `/admin/departments?id=${entityId}`;
      case "category":
        return `/admin/categories?q=${entityId}`;
      default:
        return null;
    }
  };

  const columns: ColumnDef<AuditLog>[] = React.useMemo(
    () => [
      {
        key: "createdAt",
        header: "Timestamp",
        cell: (item) => (
          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
            {formatDate(item.createdAt)}
          </span>
        ),
      },
      {
        key: "actor",
        header: "Executing Actor",
        cell: (item) => (
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-7 rounded-lg border border-border/60 shrink-0">
              <AvatarFallback className="rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[10px]">
                {(item.actor?.name || "AD").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-xs text-foreground truncate block">
                {item.actor?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate block">
                {item.actor?.email || item.actorId.slice(0, 8)}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "action",
        header: "Action",
        cell: (item) => getActionBadge(item.action),
      },
      {
        key: "entity",
        header: "Target Entity",
        cell: (item) => {
          const link = getEntityLink(item.entityType, item.entityId);
          return (
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] font-bold border-border">
                  {item.entityType}
                </Badge>
                {link ? (
                  <Link
                    href={link}
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[11px] text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-0.5"
                  >
                    #{item.entityId.slice(0, 8)}
                    <ExternalLink className="size-2.5" />
                  </Link>
                ) : (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    #{item.entityId.slice(0, 8)}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        key: "summary",
        header: "Metadata Summary",
        cell: (item) => {
          if (!item.metadata || typeof item.metadata !== "object") {
            return <span className="text-[11px] text-muted-foreground/60 italic">—</span>;
          }
          const meta = item.metadata as Record<string, unknown>;
          const note = meta.note || meta.reason || meta.role;
          const statusChange =
            meta.oldStatus && meta.newStatus
              ? `${meta.oldStatus} → ${meta.newStatus}`
              : null;

          return (
            <span className="text-[11px] text-muted-foreground truncate block max-w-xs font-mono">
              {statusChange || (typeof note === "string" ? note : JSON.stringify(meta))}
            </span>
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
    []
  );

  return (
    <DataTable
      columns={columns}
      data={logs}
      keyExtractor={(item) => item.id}
      onRowClick={onSelectLog}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}
