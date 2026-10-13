// TEMP: Platform Administrator Portal Page (to be replaced in later prompts)
import { Suspense } from "react";
import type { Metadata } from "next";
import { TempRoleDashboard } from "@/components/auth/temp-role-dashboard";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Administrator Portal",
  description: "Administrative console for municipal executive oversight and platform governance.",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <TempRoleDashboard expectedRole="ADMIN" title="Administrator Portal" />
    </Suspense>
  );
}
