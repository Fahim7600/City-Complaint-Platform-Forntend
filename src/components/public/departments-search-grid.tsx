"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, FolderTree, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { useUrlState } from "@/hooks/use-url-state";
import { getDepartmentIcon } from "@/components/admin/departments/department-icon-helper";
import type { Department } from "@/types/department";
import type { Category } from "@/types/category";

interface DepartmentsSearchGridProps {
  departments: Department[];
  categories: Category[];
}

export function DepartmentsSearchGrid({
  departments,
  categories,
}: DepartmentsSearchGridProps) {
  const { getParam, setParam } = useUrlState();
  const q = getParam("q", "");

  // Map categories by departmentId
  const deptCategoriesMap = React.useMemo(() => {
    const map = new Map<string, Category[]>();
    categories.forEach((cat) => {
      const list = map.get(cat.departmentId) || [];
      list.push(cat);
      map.set(cat.departmentId, list);
    });
    return map;
  }, [categories]);

  // Filter departments by search query
  const filteredDepartments = React.useMemo(() => {
    if (!q.trim()) return departments;
    const query = q.toLowerCase().trim();
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        (d.description && d.description.toLowerCase().includes(query)) ||
        (deptCategoriesMap.get(d.id) || []).some((c) =>
          c.name.toLowerCase().includes(query)
        )
    );
  }, [departments, q, deptCategoriesMap]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
        <div className="w-full">
          <SearchInput
            defaultValue={q}
            placeholder="Search departments or categories (e.g. water, lights, road)..."
            className="h-10 text-xs shadow-sm bg-card/60"
          />
        </div>
      </div>

      {/* Grid of Department Cards */}
      {filteredDepartments.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-border/80 bg-card/40">
          <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
            <Search className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-base text-foreground">
              No departments match &ldquo;{q}&rdquo;
            </h3>
            <p className="text-xs text-muted-foreground">
              Try a different keyword or view all departments below.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setParam("q", null)}
            className="text-xs font-semibold"
          >
            Clear search filter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => {
            const deptCats = deptCategoriesMap.get(dept.id) || [];

            return (
              <div
                key={dept.id}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-border/70 bg-card/60 hover:bg-card/95 hover:border-violet-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="space-y-5">
                  {/* Top row: Icon + Category count badge */}
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {React.createElement(getDepartmentIcon(dept.name), {
                        className: "size-6 text-violet-500 dark:text-violet-400",
                      })}
                    </div>

                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-full">
                      <FolderTree className="size-3 text-muted-foreground/70" />
                      <span>{deptCats.length} categories</span>
                    </span>
                  </div>

                  {/* Department Details */}
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {dept.description ||
                        "Official municipal agency serving civic complaints and public infrastructure maintenance."}
                    </p>
                  </div>

                  {/* Categories Pills with SLA Hours */}
                  {deptCats.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                        Service Categories & SLAs:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {deptCats.slice(0, 4).map((c) => (
                          <Badge
                            key={c.id}
                            variant="secondary"
                            className="text-[10px] font-medium px-2 py-0.5 bg-muted/60 border border-border/50 text-foreground/80 flex items-center gap-1"
                          >
                            <span>{c.name}</span>
                            <span className="text-[9px] font-mono text-teal-600 dark:text-teal-400 font-bold">
                              {c.slaHours}h
                            </span>
                          </Badge>
                        ))}
                        {deptCats.length > 4 && (
                          <span className="text-[10px] text-muted-foreground self-center pl-1 font-medium">
                            +{deptCats.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Meet the team CTA link */}
                <div className="pt-6 border-t border-border/50 mt-6">
                  <Link
                    href={`/departments/${dept.id}`}
                    className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                  >
                    <span>Meet the team & technician ratings</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
