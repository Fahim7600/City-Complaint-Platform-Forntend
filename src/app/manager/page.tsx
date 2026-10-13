// TEMP: Department Manager Portal Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Department Manager Portal",
  description: "Manager portal for complaint dispatching, triage, and SLA enforcement.",
};

export default function ManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <TempRoleDashboard expectedRole="MANAGER" title="Department Manager Portal" />
    </Suspense>
  );
}
