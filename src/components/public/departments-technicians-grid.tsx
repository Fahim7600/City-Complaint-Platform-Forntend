"use client";

import * as React from "react";
import { Star, ArrowUpDown, ShieldCheck, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlState } from "@/hooks/use-url-state";
import type { DepartmentTechnician } from "@/types/department";

interface DepartmentsTechniciansGridProps {
  technicians: DepartmentTechnician[];
}

export function DepartmentsTechniciansGrid({
  technicians,
}: DepartmentsTechniciansGridProps) {
  const { getParam, setParam } = useUrlState();
  const sort = getParam("sort", "rating");

  const sortedTechnicians = React.useMemo(() => {
    const list = [...technicians];
    if (sort === "name") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Default: by rating descending
    return list.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.reviewCount - a.reviewCount;
    });
  }, [technicians, sort]);

  return (
    <div className="space-y-6">
      {/* Top Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <span>Assigned Field Technicians</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {technicians.length}
            </Badge>
          </h3>
          <p className="text-xs text-muted-foreground">
            Verified municipal personnel assigned to investigate and complete field repairs.
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <ArrowUpDown className="size-3" />
            Sort by:
          </span>
          <Select
            value={sort}
            onValueChange={(val) => setParam("sort", val === "rating" ? null : val)}
          >
            <SelectTrigger className="w-36 h-8 text-xs bg-card">
              <SelectValue placeholder="Sort technicians" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Technicians Grid */}
      {sortedTechnicians.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-border/80 bg-card/30 space-y-3">
          <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
            <User className="size-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No technicians currently assigned to this department
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Technicians are onboarded by municipal department managers through staff applications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedTechnicians.map((tech) => {
            const initials =
              tech.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "TC";

            return (
              <div
                key={tech.id}
                className="group p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card/95 hover:border-violet-500/30 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="size-11 ring-2 ring-violet-500/20 group-hover:ring-violet-500/50 transition-all">
                      <AvatarImage src={tech.avatarUrl || undefined} alt={tech.name} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-indigo-600 text-white font-bold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-sm text-foreground truncate group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                        {tech.name}
                      </h4>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="size-3 text-teal-500" />
                        Certified Field Technician
                      </span>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  {tech.isAvailable ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold py-0.5 px-2 shrink-0">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] py-0.5 px-2 text-muted-foreground shrink-0">
                      On Assignment
                    </Badge>
                  )}
                </div>

                {/* Rating Card (Public aggregate rating only - never review text) */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-3.5 ${
                            star <= Math.round(tech.averageRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-heading text-xs font-extrabold text-foreground pl-1">
                      {tech.averageRating > 0 ? tech.averageRating.toFixed(1) : "Unrated"}
                    </span>
                  </div>

                  <span className="text-[11px] text-muted-foreground font-medium">
                    {tech.reviewCount} {tech.reviewCount === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
