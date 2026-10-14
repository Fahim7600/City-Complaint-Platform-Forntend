"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format-date";
import type { Complaint } from "@/types/complaint";

interface RecentEscalationsCardProps {
  escalations: Complaint[];
  totalCount: number;
}

export function RecentEscalationsCard({
  escalations,
  totalCount,
}: RecentEscalationsCardProps) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-card/60 backdrop-blur-sm shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <ShieldAlert className="size-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              Recent escalated tickets
              {totalCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-extrabold">
                  {totalCount} total
                </span>
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Tickets requiring executive administrator review and intervention
            </p>
          </div>
        </div>

        <Link
          href="/admin/complaints?tab=escalated"
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
        >
          <span>All escalations</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {escalations.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">No active escalations 🎉</p>
          <p className="text-[11px]">
            All municipal complaints are within regular triage limits.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {escalations.map((item) => (
            <Link
              key={item.id}
              href={`/admin/complaints?tab=escalated&id=${item.id}`}
              className="block p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.03] hover:bg-rose-500/[0.08] hover:border-rose-500/40 transition-all duration-300 group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-muted-foreground">
                    #{item.id.slice(0, 8)}
                  </span>
                  <span className="font-bold text-xs text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <StatusBadge priority={item.priority} />
                  <StatusBadge status={item.status} />
                </div>
              </div>

              {item.escalationReason && (
                <p className="text-xs text-rose-600/90 dark:text-rose-400/90 line-clamp-1 mb-1.5 italic flex items-center gap-1">
                  <AlertTriangle className="size-3 shrink-0" />
                  <span>&quot;{item.escalationReason}&quot;</span>
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                <span>
                  {item.department?.name || "General Department"} •{" "}
                  {item.category?.name || "Civic Incident"}
                </span>
                <span>
                  {item.escalatedAt
                    ? `Escalated ${formatDate(item.escalatedAt)}`
                    : formatDate(item.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
