"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Search, Star, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { departmentService } from "@/services/department.service";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/axios";
import { ComplaintStatus, type Complaint } from "@/types/complaint";
import type { PaginatedData } from "@/types/api";
import { cn } from "@/lib/utils";

interface AssignTechnicianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint;
  isReassign?: boolean;
}

export function AssignTechnicianDialog({
  open,
  onOpenChange,
  complaint,
  isReassign = false,
}: AssignTechnicianDialogProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [selectedTechId, setSelectedTechId] = React.useState<string | null>(null);

  // Fetch technicians of this complaint's department
  const { data: technicians = [], isLoading: isTechsLoading } = useQuery({
    queryKey: queryKeys.departments.technicians(complaint.departmentId),
    queryFn: () => departmentService.getMyTechnicians(complaint.departmentId),
    enabled: open && Boolean(complaint.departmentId),
  });

  // Filter technicians
  const filteredTechnicians = React.useMemo(() => {
    return technicians.filter((tech) => {
      // Exclude current technician if reassigning
      if (isReassign && tech.id === complaint.assignedTechnicianId) {
        return false;
      }
      if (search.trim()) {
        return tech.name.toLowerCase().includes(search.toLowerCase().trim());
      }
      return true;
    });
  }, [technicians, isReassign, complaint.assignedTechnicianId, search]);

  const selectedTech = technicians.find((t) => t.id === selectedTechId);

  // Assign mutation with optimistic update
  const assignMutation = useMutation({
    mutationFn: (techId: string) => complaintService.assign(complaint.id, techId),
    onMutate: async (techId: string) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.complaints.all,
      });

      // Snapshot previous detail
      const previousDetail = queryClient.getQueryData<Complaint>(
        queryKeys.complaints.detail(complaint.id)
      );

      const targetTech = technicians.find((t) => t.id === techId);

      // Optimistically update detail
      if (previousDetail) {
        queryClient.setQueryData<Complaint>(
          queryKeys.complaints.detail(complaint.id),
          {
            ...previousDetail,
            status: ComplaintStatus.ASSIGNED,
            assignedTechnicianId: techId,
            assignedTechnician: targetTech
              ? {
                  id: targetTech.id,
                  name: targetTech.name,
                  email: "",
                  role: "TECHNICIAN",
                  isPremium: false,
                  isAvailable: targetTech.isAvailable,
                  phone: null,
                  avatarUrl: targetTech.avatarUrl,
                  departmentId: complaint.departmentId,
                  requestedRole: null,
                  approvalStatus: "APPROVED",
                  decidedById: null,
                  decidedAt: null,
                  experience: targetTech.experience,
                  qualification: targetTech.qualification,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  deletedAt: null,
                }
              : previousDetail.assignedTechnician,
          }
        );
      }

      // Optimistically update list queries
      queryClient.setQueriesData<PaginatedData<Complaint>>(
        { queryKey: queryKeys.complaints.all },
        (old) => {
          if (!old || !old.items) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === complaint.id
                ? {
                    ...item,
                    status: ComplaintStatus.ASSIGNED,
                    assignedTechnicianId: techId,
                    assignedTechnician: targetTech
                      ? {
                          id: targetTech.id,
                          name: targetTech.name,
                          email: "",
                          role: "TECHNICIAN",
                          isPremium: false,
                          isAvailable: targetTech.isAvailable,
                          phone: null,
                          avatarUrl: targetTech.avatarUrl,
                          departmentId: complaint.departmentId,
                          requestedRole: null,
                          approvalStatus: "APPROVED",
                          decidedById: null,
                          decidedAt: null,
                          experience: targetTech.experience,
                          qualification: targetTech.qualification,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          deletedAt: null,
                        }
                      : item.assignedTechnician,
                  }
                : item
            ),
          };
        }
      );

      return { previousDetail };
    },
    onError: (err, _newVal, context) => {
      // Rollback on error
      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.complaints.detail(complaint.id),
          context.previousDetail
        );
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      toast.error(getErrorMessage(err) || "Failed to assign technician.");
    },
    onSuccess: () => {
      toast.success(
        `Assigned to ${selectedTech?.name || "technician"}`
      );
      onOpenChange(false);
      setSelectedTechId(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(complaint.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.departments.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });

  const handleConfirm = () => {
    if (!selectedTechId) return;
    assignMutation.mutate(selectedTechId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
            <UserCheck className="size-5 text-violet-500" />
            {isReassign ? "Reassign Field Technician" : "Assign Technician"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select an available technician from your department to dispatch for{" "}
            <span className="font-semibold text-foreground">
              &quot;{complaint.title}&quot;
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative my-2">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search technicians by name..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Technicians List */}
        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {isTechsLoading ? (
            <div className="py-8 flex flex-col items-center justify-center text-xs text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin text-violet-500" />
              <span>Loading department technicians...</span>
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
              <Users className="size-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-semibold">No technicians found</p>
              <p className="text-[11px]">
                {search ? "Try adjusting your search query." : "No active technicians assigned to this department."}
              </p>
            </div>
          ) : (
            filteredTechnicians.map((tech) => {
              const isSelected = selectedTechId === tech.id;
              const isAvailable = tech.isAvailable;

              return (
                <div
                  key={tech.id}
                  onClick={() => {
                    if (isAvailable) {
                      setSelectedTechId(tech.id);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                    !isAvailable && "opacity-60 cursor-not-allowed bg-muted/30 border-border/40",
                    isAvailable && "cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5",
                    isSelected && "border-violet-500 bg-violet-500/10 ring-1 ring-violet-500/30"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-9 rounded-xl border border-border/70">
                      {tech.avatarUrl && <AvatarImage src={tech.avatarUrl} alt={tech.name} />}
                      <AvatarFallback className="rounded-xl bg-violet-500/15 text-violet-600 font-bold text-xs">
                        {tech.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">
                          {tech.name}
                        </span>
                        {isSelected && (
                          <Check className="size-3.5 text-violet-500 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                          <Star className="size-3 fill-amber-500" />
                          {tech.averageRating > 0 ? tech.averageRating.toFixed(1) : "New"}
                        </span>
                        <span>•</span>
                        <span>{tech.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isAvailable ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Available
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold"
                      >
                        On leave
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-end gap-2 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={assignMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedTechId || assignMutation.isPending}
            className="text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-500/20"
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserCheck className="size-3.5 mr-1.5" />
                Confirm Assignment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
