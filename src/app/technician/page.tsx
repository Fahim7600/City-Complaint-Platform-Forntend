// TEMP: Technician Portal Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Technician Portal",
  description: "Technician portal for assigned work orders and service resolutions.",
};

export default function TechnicianPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <TempRoleDashboard expectedRole="TECHNICIAN" title="Technician Portal" />
    </Suspense>
  );
}
