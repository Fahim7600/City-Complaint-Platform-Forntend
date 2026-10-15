import * as React from "react";
import Link from "next/link";
import { ArrowRight, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDepartmentIcon } from "@/components/admin/departments/department-icon-helper";
import type { Department } from "@/types/department";
import type { Category } from "@/types/category";

interface HomeDepartmentsPreviewProps {
  departments?: Department[];
  categories?: Category[];
}

export function HomeDepartmentsPreview({
  departments = [],
  categories = [],
}: HomeDepartmentsPreviewProps) {
  const displayDepartments = departments.slice(0, 6);

  // Group categories count by department
  const categoryCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    categories.forEach((cat) => {
      map.set(cat.departmentId, (map.get(cat.departmentId) || 0) + 1);
    });
    return map;
  }, [categories]);

  if (displayDepartments.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Municipal Services
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
              City Departments
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
              Specialized municipal agencies handling water, electrical grids, road maintenance, and sanitation across our metropolis.
            </p>
          </div>

          <Link href="/departments" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 border-border/80 hover:bg-muted"
            >
              <span>View all {departments.length} departments</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDepartments.map((dept) => {
            const count = categoryCounts.get(dept.id) || 0;

            return (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                className="group relative flex flex-col justify-between p-6 rounded-3xl border border-border/70 bg-card/60 hover:bg-card/95 hover:border-violet-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {React.createElement(getDepartmentIcon(dept.name), {
                        className: "size-6 text-violet-500 dark:text-violet-400",
                      })}
                    </div>

                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 bg-muted/60 px-2.5 py-1 rounded-full">
                      <FolderTree className="size-3 text-muted-foreground/70" />
                      <span>{count} {count === 1 ? "category" : "categories"}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-base text-foreground group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {dept.description || "Active municipal department providing frontline civic maintenance and infrastructure operations."}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  <span>Meet technicians & SLAs</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
