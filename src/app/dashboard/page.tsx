// TEMP: Citizen Dashboard Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Citizen Dashboard",
  description: "Citizen portal for filing complaints and tracking municipal services.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <TempRoleDashboard expectedRole="CITIZEN" title="Citizen Dashboard" />
    </Suspense>
  );
}
