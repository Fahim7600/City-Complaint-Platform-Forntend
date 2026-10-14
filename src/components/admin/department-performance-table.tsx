"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, ChevronRight, Clock, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DepartmentDashboardBreakdown } from "@/types/stats";

interface DepartmentPerformanceTableProps {
  departments: DepartmentDashboardBreakdown[];
}

export function DepartmentPerformanceTable({
  departments,
}: DepartmentPerformanceTableProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
            <Building2 className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Department performance breakdown
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Municipal agency workload, resolution volume, and SLA compliance
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          {departments.length} departments
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground font-semibold">
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-center">Total Tickets</th>
              <th className="py-3 px-4 text-center">Open Active</th>
              <th className="py-3 px-4 text-center">Resolved</th>
              <th className="py-3 px-4 text-center">Overdue SLA</th>
              <th className="py-3 px-4 text-center">Technicians</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No department metrics found
                </td>
              </tr>
            ) : (
              departments.map((dep) => {
                const open =
                  (dep.complaintsByStatus?.PENDING || 0) +
                  (dep.complaintsByStatus?.ASSIGNED || 0) +
                  (dep.complaintsByStatus?.IN_PROGRESS || 0);
                const resolved =
                  (dep.complaintsByStatus?.RESOLVED || 0) +
                  (dep.complaintsByStatus?.CLOSED || 0);
                const overdue = dep.overdueCount || 0;

                return (
                  <tr
                    key={dep.departmentId}
                    className="group hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <Link
                        href={`/admin/complaints?departmentId=${dep.departmentId}`}
                        className="hover:text-violet-500 transition-colors flex items-center gap-2"
                      >
                        <Building2 className="size-3.5 text-muted-foreground group-hover:text-violet-500" />
                        <span>{dep.departmentName}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold">
                      {dep.totalComplaints}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                        {open}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        {resolved}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {overdue > 0 ? (
                        <Badge
                          variant="destructive"
                          className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold"
                        >
                          <Clock className="size-2.5 mr-1" />
                          {overdue}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground font-mono">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-muted-foreground font-semibold">
                        <Wrench className="size-3 text-teal-500" />
                        {dep.technicianCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/complaints?departmentId=${dep.departmentId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
                      >
                        <span>View queue</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
