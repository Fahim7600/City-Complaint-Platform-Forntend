import * as React from "react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { publicServerService } from "@/services/public.server";
import type { Department } from "@/types/department";

export const revalidate = 300;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let departments: Department[] = [];
  try {
    departments = await publicServerService.getDepartments();
  } catch (error) {
    // If backend is unreachable or warming up, fallback gracefully
    console.warn("[PublicLayout] Could not prefetch departments for footer:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-teal-500/20 selection:text-teal-600 dark:selection:text-teal-400">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter departments={departments} />
    </div>
  );
}
