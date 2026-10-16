"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Complaint } from "@/types/complaint";

interface BlockingComplaintsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technicianName: string;
  blockingComplaintIds: string[];
  departmentComplaints?: Complaint[];
}

export function BlockingComplaintsDialog({
  open,
  onOpenChange,
  technicianName,
  blockingComplaintIds,
  departmentComplaints = [],
}: BlockingComplaintsDialogProps) {
  // Map complaint IDs to complaint details if available
  const complaintLookup = React.useMemo(() => {
    const map = new Map<string, Complaint>();
    departmentComplaints.forEach((c) => map.set(c.id, c));
    return map;
  }, [departmentComplaints]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <div className="size-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
            <ShieldAlert className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Can&apos;t remove {technicianName} yet
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            This technician currently has{" "}
            <span className="font-semibold text-foreground">
              {blockingComplaintIds.length} active{" "}
              {blockingComplaintIds.length === 1 ? "complaint" : "complaints"}
            </span>{" "}
            in Assigned or In-Progress status. They cannot be removed until these
            assignments are resolved or reassigned.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Blocking Complaints List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {blockingComplaintIds.map((id) => {
              const complaint = complaintLookup.get(id);
              const shortId = `#${id.slice(0, 8)}`;
              const title = complaint?.title || "Active field assignment";

              return (
                <div
                  key={id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card/60 hover:bg-card/90 transition-colors gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                        {shortId}
                      </span>
                      {complaint?.status && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          {complaint.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">
                      {title}
                    </p>
                  </div>

                  <Link
                    href={`/manager?id=${id}`}
                    onClick={() => onOpenChange(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-500 shrink-0 hover:underline"
                  >
                    <span>View</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Hint note: Managers can only assign PENDING complaints; active reassignment is done by Admin */}
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="size-4 shrink-0" />
              <span>Reassignment Required</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Reassign these complaints first. Reassignment of active jobs is
              done by the Admin. (Department managers can assign pending complaints; active reassignment requires platform administrator privileges.)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
