import * as React from "react";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { publicServerService } from "@/services/public.server";
import { siteConfig } from "@/lib/site-config";
import { DepartmentsSearchGrid } from "@/components/public/departments-search-grid";
import type { Department } from "@/types/department";
import type { Category } from "@/types/category";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Municipal Departments & SLAs — ${siteConfig.name}`,
  description:
    "Explore city departments, public service categories, guaranteed SLA target resolution hours, and verified field technician teams.",
  openGraph: {
    title: `Municipal Departments & SLAs — ${siteConfig.name}`,
    description:
      "Explore city departments, public service categories, guaranteed SLA target resolution hours, and verified field technician teams.",
    url: `${siteConfig.url}/departments`,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "CityFix Municipal Departments",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Municipal Departments & SLAs — ${siteConfig.name}`,
    description:
      "Explore city departments, public service categories, guaranteed SLA target resolution hours, and verified field technician teams.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default async function DepartmentsPage() {
  let departments: Department[] = [];
  let categories: Category[] = [];

  try {
    const [depts, cats] = await Promise.all([
      publicServerService.getDepartments(),
      publicServerService.getCategories(),
    ]);
    departments = depts;
    categories = cats;
  } catch (error) {
    console.warn("[DepartmentsPage] Could not load departments:", error);
  }

  return (
    <div className="py-12 sm:py-20 space-y-12">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400">
          <Sparkles className="size-3.5" />
          <span>Municipal Agency Directory</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          City Departments & Service Categories
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Browse all active municipal agencies, guaranteed SLA turnaround hours, and connect with assigned field technician teams.
        </p>
      </section>

      {/* Main Grid with Search Island */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DepartmentsSearchGrid
          departments={departments}
          categories={categories}
        />
      </section>
    </div>
  );
}
