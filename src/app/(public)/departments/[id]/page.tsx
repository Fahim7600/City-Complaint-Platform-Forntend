import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, FolderTree, Tag, ArrowRight } from "lucide-react";
import { publicServerService } from "@/services/public.server";
import { siteConfig } from "@/lib/site-config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDepartmentIcon } from "@/components/admin/departments/department-icon-helper";
import { DepartmentsTechniciansGrid } from "@/components/public/departments-technicians-grid";
import { DataUnavailableCard } from "@/components/public/data-unavailable-card";

export const revalidate = 300;
export const dynamicParams = true;

interface DepartmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const departments = await publicServerService.getDepartments();
    return departments.map((d) => ({ id: d.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: DepartmentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const departments = await publicServerService.getDepartments();
    const dept = departments.find((d) => d.id === id);

    if (!dept) {
      return {
        title: `Department Details — ${siteConfig.name}`,
      };
    }

    return {
      title: `${dept.name} — Department Operations & Technicians | ${siteConfig.name}`,
      description:
        dept.description ||
        `Public municipal information, service categories, SLA turnaround times, and verified field technicians for ${dept.name}.`,
      openGraph: {
        title: `${dept.name} — ${siteConfig.name}`,
        description: dept.description || siteConfig.description,
        url: `${siteConfig.url}/departments/${id}`,
        siteName: siteConfig.name,
      },
    };
  } catch {
    return {
      title: `Department Details — ${siteConfig.name}`,
    };
  }
}

export default async function DepartmentDetailPage({
  params,
}: DepartmentDetailPageProps) {
  const { id } = await params;

  const [allDepts, allCats, techList] = await Promise.all([
    publicServerService.getDepartments(),
    publicServerService.getCategories(),
    publicServerService.getDepartmentTechnicians(id),
  ]);

  if (allDepts.length === 0) {
    return (
      <div className="py-12 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DataUnavailableCard
          title="Live data is temporarily unavailable — refreshing shortly"
          message="Department details are synchronizing with municipal servers. Please check back shortly."
        />
      </div>
    );
  }

  const department = allDepts.find((d) => d.id === id);
  if (!department) {
    notFound();
  }

  const categories = allCats.filter((c) => c.departmentId === id);
  const technicians = techList;

  return (
    <div className="py-10 sm:py-16 space-y-12">
      {/* 1. Breadcrumb & Back */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>All Departments</span>
        </Link>
      </div>

      {/* 2. Department Header Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-muted/20 p-6 sm:p-10 backdrop-blur-xl shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="size-16 sm:size-20 rounded-3xl bg-gradient-to-tr from-violet-500/20 to-indigo-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 shadow-md">
                {React.createElement(getDepartmentIcon(department.name), {
                  className: "size-8 sm:size-10 text-violet-500 dark:text-violet-400",
                })}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                    Municipal Agency
                  </span>
                  <span className="size-1 rounded-full bg-border" />
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {department.id.slice(0, 8)}
                  </span>
                </div>
                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {department.name}
                </h1>
              </div>
            </div>

            <Link href={`/dashboard/complaints/new?departmentId=${department.id}`}>
              <Button
                size="sm"
                className="text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-1.5"
              >
                <span>Report an issue to this dept</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {department.description ||
              "Official municipal department handling field repairs, dispatching certified technicians, and honoring guaranteed category resolution SLAs."}
          </p>

          {/* Service Categories with SLA Promises */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <FolderTree className="size-3.5 text-teal-500" />
              <span>Service Categories & Guaranteed SLA Deadlines</span>
            </h3>

            {categories.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No specific service categories registered under this department yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/dashboard/complaints/new?categoryId=${cat.id}`}
                    className="group"
                  >
                    <div className="p-3.5 rounded-2xl border border-border/60 bg-muted/40 hover:bg-muted/70 hover:border-violet-500/40 transition-colors flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Tag className="size-3.5 text-muted-foreground group-hover:text-violet-500 transition-colors shrink-0" />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {cat.name}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20 shrink-0 flex items-center gap-1"
                      >
                        <Clock className="size-2.5" />
                        <span>{cat.slaHours}h target</span>
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Technicians Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DepartmentsTechniciansGrid technicians={technicians} />
      </section>
    </div>
  );
}
