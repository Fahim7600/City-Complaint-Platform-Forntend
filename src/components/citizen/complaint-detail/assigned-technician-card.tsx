"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Clock,
  HardHat,
  Star,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { technicianService } from "@/services/technician.service";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import type { Complaint } from "@/types/complaint";

interface AssignedTechnicianCardProps {
  complaint: Complaint;
}

export function AssignedTechnicianCard({
  complaint,
}: AssignedTechnicianCardProps) {
  const techId = complaint.assignedTechnicianId;

  // Query rating aggregate if technician is assigned
  const { data: ratingData } = useQuery({
    queryKey: techId ? queryKeys.technicians.rating(techId) : ["tech-none"],
    queryFn: () => (techId ? technicianService.getTechnicianRating(techId) : null),
    enabled: Boolean(techId),
  });

  // Query department technicians to resolve full name & avatar if not populated
  const { data: deptTechs } = useQuery({
    queryKey: complaint.departmentId
      ? queryKeys.departments.technicians(complaint.departmentId)
      : ["dept-tech-none"],
    queryFn: () =>
      complaint.departmentId
        ? publicService.getDepartmentTechnicians(complaint.departmentId)
        : [],
    enabled: Boolean(complaint.departmentId && techId),
  });

  const matchingTech = deptTechs?.find((t) => t.id === techId);

  const techName =
    complaint.assignedTechnician?.name ||
    matchingTech?.name ||
    "Field Technician";

  const techAvatar =
    complaint.assignedTechnician?.avatarUrl ||
    matchingTech?.avatarUrl ||
    undefined;

  const initials = techName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avgRating = ratingData?.averageRating ?? matchingTech?.averageRating;
  const reviewCount = ratingData?.reviewCount ?? matchingTech?.reviewCount;

  if (!techId) {
    return (
      <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-amber-400 opacity-20" />
              <Clock className="size-4.5" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-semibold text-foreground">
                Waiting for Assignment
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Awaiting technician dispatch
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
            Your complaint is in the queue for{" "}
            <strong className="text-foreground">
              {complaint.department?.name || "Municipal Services"}
            </strong>
            . A manager will assign an available technician shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <HardHat className="size-4 text-violet-500" />
            Assigned Technician
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <UserCheck className="size-3" />
            Dispatched
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <Avatar className="size-12 rounded-xl border border-border/80 shadow-sm">
            {techAvatar && <AvatarImage src={techAvatar} alt={techName} />}
            <AvatarFallback className="rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="font-heading text-sm font-bold text-foreground truncate">
              {techName}
            </h4>
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Building2 className="size-3 text-muted-foreground" />
              {complaint.department?.name || "Municipal Department"}
            </p>
          </div>
        </div>

        {/* Rating summary if available */}
        {avgRating !== null && avgRating !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground">Technician Rating:</span>
            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-foreground">
                {avgRating}
              </span>
              {reviewCount !== undefined && (
                <span className="text-muted-foreground text-[11px]">
                  ({reviewCount} reviews)
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
