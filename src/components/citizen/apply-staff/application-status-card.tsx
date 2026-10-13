"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  HardHat,
  LogOut,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ApprovalStatus, type User } from "@/types/user";

interface ApplicationStatusCardProps {
  user: User;
  onApplyAgain?: () => void;
}

export function ApplicationStatusCard({
  user,
  onApplyAgain,
}: ApplicationStatusCardProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const status = user.approvalStatus;
  const roleName = user.requestedRole === "MANAGER" ? "Department Manager" : "Field Technician";

  // APPROVED STATUS
  if (status === ApprovalStatus.APPROVED) {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/10 shadow-lg overflow-hidden">
        <CardContent className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 mb-1">
                Approved
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Staff Application Approved!
              </h3>
              <p className="text-xs text-muted-foreground">
                Congratulations, your application to join as a <strong className="text-foreground">{roleName}</strong> has been granted.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background/80 border border-emerald-500/30 text-xs text-muted-foreground space-y-2">
            <p>
              Your user account permissions have been upgraded. Please sign out and sign back in to reload your active credentials and access your new municipal operations dashboard.
            </p>
          </div>

          {/* Red destructive sign out button */}
          <Button
            variant="destructive"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full sm:w-auto font-semibold shadow-sm"
          >
            <LogOut className="size-4 mr-2" />
            {isLoggingOut ? "Signing out..." : "Sign out now"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // REJECTED STATUS
  if (status === ApprovalStatus.REJECTED) {
    return (
      <Card className="border-rose-500/40 bg-rose-500/10 shadow-md overflow-hidden">
        <CardContent className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/30">
              <XCircle className="size-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-600 dark:text-rose-300 mb-1">
                Not Approved
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Application Declined
              </h3>
              <p className="text-xs text-muted-foreground">
                Your staff application for <strong className="text-foreground">{roleName}</strong> was evaluated and could not be approved at this time.
              </p>
            </div>
          </div>

          {user.experience && (
            <div className="p-4 rounded-xl bg-background/80 border border-rose-500/30 text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">Application Feedback:</span>
              <p className="italic">
                The department has reached capacity or requires additional field certifications.
              </p>
            </div>
          )}

          {onApplyAgain && (
            <Button
              variant="outline"
              onClick={onApplyAgain}
              className="text-xs font-semibold"
            >
              <RefreshCw className="size-3.5 mr-1.5" />
              Apply Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // PENDING STATUS (Default when approvalStatus === PENDING)
  return (
    <Card className="border-amber-500/40 bg-amber-500/10 shadow-md overflow-hidden">
      <CardContent className="p-6 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-amber-400 opacity-30" />
              <Clock className="size-6" />
            </div>
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-600 dark:text-amber-300 mb-1">
                Under Review
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Application Under Active Review
              </h3>
              <p className="text-xs text-muted-foreground">
                Your request to join as a <strong className="text-foreground">{roleName}</strong> is currently being inspected by municipal managers.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-background/80 border border-border/70 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
              Target Role
            </span>
            <p className="font-bold text-foreground flex items-center gap-1.5 pt-0.5">
              <HardHat className="size-3.5 text-violet-500" />
              {roleName}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
              Current Status
            </span>
            <p className="font-bold text-amber-500 flex items-center gap-1.5 pt-0.5">
              <Clock className="size-3.5" />
              Awaiting Supervisor Decision
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          You will receive an in-app alert as soon as the department director approves or updates your application.
        </p>
      </CardContent>
    </Card>
  );
}
