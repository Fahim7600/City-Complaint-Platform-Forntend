"use client";

import * as React from "react";
import { Lock, User } from "lucide-react";
import { AvailabilityCard } from "./availability-card";
import { PageHeader } from "@/components/shared/page-header";
import { PageSkeleton } from "@/components/shared/skeletons";
import { ProfileForm } from "@/components/shared/profile/profile-form";
import { SecurityForm } from "@/components/shared/profile/security-form";
import { AccountSummaryCard } from "@/components/shared/profile/account-summary-card";
import { useUrlState } from "@/hooks/use-url-state";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function TechnicianProfileView() {
  const { user, isLoading } = useAuth();
  const { getParam, setParam } = useUrlState();

  const activeTab = getParam("tab", "profile");

  const handleTabChange = (tab: "profile" | "security") => {
    setParam("tab", tab === "profile" ? null : tab);
  };

  if (isLoading || !user) {
    return <PageSkeleton hasStats={false} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <PageHeader
        title="Profile & Dispatch Settings"
        description="Manage your field technician account details, availability for new assignments, and security preferences."
      />

      {/* 1. Availability Switch Card at the top */}
      <AvailabilityCard />

      {/* 2. Tabs Header synced to URL (?tab=profile | security) */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-px">
        <button
          type="button"
          onClick={() => handleTabChange("profile")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px",
            activeTab === "profile"
              ? "border-violet-500 text-violet-600 dark:text-violet-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="size-4" />
          Profile Details
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("security")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 -mb-px",
            activeTab === "security"
              ? "border-violet-500 text-violet-600 dark:text-violet-400 font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Lock className="size-4" />
          Security & Password
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <ProfileForm user={user} />
          <AccountSummaryCard user={user} />
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <SecurityForm user={user} />
        </div>
      )}
    </div>
  );
}
