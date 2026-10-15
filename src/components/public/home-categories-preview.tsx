import * as React from "react";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Department } from "@/types/department";
import type { Category } from "@/types/category";

interface HomeCategoriesPreviewProps {
  departments?: Department[];
  categories?: Category[];
}

export function HomeCategoriesPreview({
  departments = [],
  categories = [],
}: HomeCategoriesPreviewProps) {
  if (categories.length === 0) return null;

  // Group categories by department
  const grouped = React.useMemo(() => {
    const deptMap = new Map<string, { dept: Department; cats: Category[] }>();

    departments.forEach((d) => {
      deptMap.set(d.id, { dept: d, cats: [] });
    });

    categories.forEach((c) => {
      const entry = deptMap.get(c.departmentId);
      if (entry) {
        entry.cats.push(c);
      }
    });

    return Array.from(deptMap.values()).filter((item) => item.cats.length > 0);
  }, [departments, categories]);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Rapid Resolution Categories
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
            Supported Complaint Categories & SLAs
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every category has a legally guaranteed Service Level Agreement (SLA). Select any service category to submit an issue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grouped.slice(0, 6).map(({ dept, cats }) => (
            <div
              key={dept.id}
              className="p-6 rounded-3xl border border-border/70 bg-card/40 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <h3 className="font-heading font-bold text-sm text-foreground truncate">
                    {dept.name}
                  </h3>
                  <Link
                    href={`/departments/${dept.id}`}
                    className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    View dept →
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cats.slice(0, 5).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/dashboard/complaints/new?categoryId=${cat.id}`}
                      className="group"
                    >
                      <Badge
                        variant="secondary"
                        className="px-2.5 py-1 text-[11px] font-medium bg-muted/70 hover:bg-violet-500/15 hover:border-violet-500/40 border border-border/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Tag className="size-2.5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-muted-foreground/80 font-mono flex items-center gap-0.5 pl-0.5">
                          <Clock className="size-2.5 text-teal-500" />
                          {cat.slaHours}h
                        </span>
                      </Badge>
                    </Link>
                  ))}
                  {cats.length > 5 && (
                    <span className="text-[11px] text-muted-foreground/80 self-center pl-1 font-medium">
                      +{cats.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
