"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Building2,
  Clock,
  Construction,
  Droplets,
  Lightbulb,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { publicService } from "@/services/public.service";
import { queryKeys } from "@/lib/query-keys";
import type { Category } from "@/types/category";
import { cn } from "@/lib/utils";

interface Step1CategoryProps {
  selectedCategoryId?: string;
  onSelectCategory: (category: {
    id: string;
    name: string;
    departmentId: string;
    departmentName: string;
  }) => void;
  error?: string;
}

function getCategoryIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (
    lower.includes("road") ||
    lower.includes("street") ||
    lower.includes("pothole") ||
    lower.includes("traffic") ||
    lower.includes("sidewalk") ||
    lower.includes("transport")
  ) {
    return Construction;
  }
  if (
    lower.includes("water") ||
    lower.includes("pipe") ||
    lower.includes("leak") ||
    lower.includes("drainage") ||
    lower.includes("sewage")
  ) {
    return Droplets;
  }
  if (
    lower.includes("light") ||
    lower.includes("lamp") ||
    lower.includes("electric") ||
    lower.includes("power")
  ) {
    return Lightbulb;
  }
  if (
    lower.includes("waste") ||
    lower.includes("garbage") ||
    lower.includes("trash") ||
    lower.includes("sanitation") ||
    lower.includes("clean")
  ) {
    return Trash2;
  }
  return AlertCircle;
}

export function Step1Category({
  selectedCategoryId,
  onSelectCategory,
  error,
}: Step1CategoryProps) {
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: queryKeys.categories.publicList(),
    queryFn: publicService.getCategories,
  });

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={`cat-skel-${i}`} className="p-4 space-y-3">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
        <h4 className="font-semibold text-sm text-destructive">
          Failed to load complaint categories
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          Please check your network connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Select Complaint Category
        </h3>
        <p className="text-xs text-muted-foreground">
          Choose the civic department or issue type that best matches your problem.
        </p>
      </div>

      {error && (
        <p className="text-xs font-semibold text-destructive">{error}</p>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {categories.map((cat: Category) => {
          const Icon = getCategoryIcon(cat.name);
          const isSelected = cat.id === selectedCategoryId;
          const departmentName = cat.department?.name || "Municipal Services";

          return (
            <Card
              key={cat.id}
              onClick={() =>
                onSelectCategory({
                  id: cat.id,
                  name: cat.name,
                  departmentId: cat.departmentId,
                  departmentName,
                })
              }
              className={cn(
                "group relative cursor-pointer overflow-hidden p-4 transition-all duration-300",
                "border bg-card/60 backdrop-blur-sm hover:-translate-y-0.5",
                isSelected
                  ? "border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-2 ring-violet-500/40"
                  : "border-border/70 hover:border-violet-500/50 hover:bg-card/90"
              )}
            >
              <CardContent className="p-0 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl border transition-all duration-300",
                      isSelected
                        ? "border-violet-500/40 bg-violet-500 text-white shadow-md shadow-violet-500/30"
                        : "border-border/60 bg-muted/60 text-muted-foreground group-hover:text-violet-500 group-hover:bg-violet-500/10 group-hover:border-violet-500/30"
                    )}
                  >
                    <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full border border-border/50">
                    <Clock className="size-3" />
                    {cat.slaHours}h SLA
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h4>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                  <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{departmentName}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Category routing banner */}
      {selectedCategory && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 transition-all duration-300 flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
            <Building2 className="size-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-300">
              Department Routing Confirmed
            </p>
            <p className="text-xs text-muted-foreground">
              Your complaint will be routed to{" "}
              <strong className="text-foreground">
                {selectedCategory.department?.name || "Municipal Services"}
              </strong>{" "}
              with a target resolution SLA of {selectedCategory.slaHours} hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
