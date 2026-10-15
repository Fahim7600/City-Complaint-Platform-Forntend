"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Clock,
  FolderTree,
  Star,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDepartmentIcon } from "./department-icon-helper";
import { adminService } from "@/services/admin.service";
import { departmentService } from "@/services/department.service";
import { queryKeys } from "@/lib/query-keys";
import type { Department } from "@/types/department";

interface DepartmentDetailSheetProps {
  department: Department | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepartmentDetailSheet({
  department,
  open,
  onOpenChange,
}: DepartmentDetailSheetProps) {
  const departmentId = department?.id || "";

  // 1. Fetch categories for this department
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: queryKeys.categories.byDepartment(departmentId),
    queryFn: () => adminService.getCategories(departmentId),
    enabled: open && Boolean(departmentId),
  });

  // 2. Fetch technicians for this department
  const { data: technicians = [], isLoading: isTechsLoading } = useQuery({
    queryKey: queryKeys.departments.technicians(departmentId),
    queryFn: () => departmentService.getMyTechnicians(departmentId),
    enabled: open && Boolean(departmentId),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col gap-0 border-l border-border/80 bg-background/95 backdrop-blur-md overflow-hidden"
      >
        {department && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border/60 bg-muted/20 space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="size-12 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 shadow-sm">
                  {React.createElement(
                    department ? getDepartmentIcon(department.name) : Building2,
                    { className: "size-6 text-violet-500 dark:text-violet-400" }
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <SheetTitle className="font-heading text-lg font-bold text-foreground">
                    {department.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground line-clamp-2">
                    {department.description || "Active municipal department overview, service categories, and assigned technicians."}
                  </SheetDescription>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderTree className="size-4 text-violet-500" />
                    <h4 className="font-heading font-bold text-sm text-foreground">
                      Service Categories ({categories.length})
                    </h4>
                  </div>
                </div>

                {isCategoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-16 rounded-xl border border-border/40 bg-card/40 animate-pulse"
                      />
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No categories registered for this department yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-3.5 rounded-xl border border-border/60 bg-card/50 flex items-start justify-between gap-3 transition-colors hover:border-violet-500/30"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {cat.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px] font-bold border-border bg-background gap-1 text-muted-foreground"
                        >
                          <Clock className="size-2.5 text-amber-500" />
                          {cat.slaHours}h SLA
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Technicians */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-teal-500" />
                    <h4 className="font-heading font-bold text-sm text-foreground">
                      Assigned Field Technicians ({technicians.length})
                    </h4>
                  </div>
                </div>

                {isTechsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-14 rounded-xl border border-border/40 bg-card/40 animate-pulse"
                      />
                    ))}
                  </div>
                ) : technicians.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No active technicians appointed to this department.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {technicians.map((tech) => (
                      <div
                        key={tech.id}
                        className="p-3 rounded-xl border border-border/60 bg-card/50 flex items-center justify-between gap-3 transition-colors hover:border-teal-500/30"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar className="size-8 rounded-lg border border-border/60">
                            {tech.avatarUrl && (
                              <AvatarImage src={tech.avatarUrl} alt={tech.name} />
                            )}
                            <AvatarFallback className="text-[10px] font-bold rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                              {tech.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {tech.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                <Star className="size-2.5 fill-amber-500 text-amber-500" />
                                {tech.averageRating > 0 ? tech.averageRating.toFixed(1) : "New"}
                              </span>
                              <span>•</span>
                              <span>{tech.reviewCount} reviews</span>
                            </div>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={
                            tech.isAvailable
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold gap-1"
                              : "border-border bg-muted/50 text-muted-foreground text-[10px] font-semibold gap-1"
                          }
                        >
                          {tech.isAvailable ? (
                            <>
                              <CheckCircle2 className="size-2.5" />
                              Available
                            </>
                          ) : (
                            <>
                              <XCircle className="size-2.5" />
                              On Leave
                            </>
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
