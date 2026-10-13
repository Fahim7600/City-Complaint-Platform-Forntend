"use client";

// TEMP: Component for testing authentication & role-based routing
import * as React from "react";
import { LogOut, Shield, Sparkles, UserCheck, Wrench, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/user";

interface TempRoleDashboardProps {
  expectedRole: Role;
  title: string;
}

export function TempRoleDashboard({ expectedRole, title }: TempRoleDashboardProps) {
  const { user, role, logout, isLoading } = useAuth();

  const getRoleIcon = () => {
    switch (expectedRole) {
      case "CITIZEN":
        return <UserCheck className="size-6 text-[#327c69] dark:text-[#77b7a8]" />;
      case "TECHNICIAN":
        return <Wrench className="size-6 text-[#a855f7]" />;
      case "MANAGER":
        return <Briefcase className="size-6 text-[#c084fc]" />;
      case "ADMIN":
        return <Shield className="size-6 text-[#ef4444]" />;
    }
  };

  return (
    <div className="flex items-center justify-center py-6 sm:py-12">
      <Card className="w-full max-w-lg border border-border/80 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted/80 mb-3 shadow-inner">
            {getRoleIcon()}
          </div>
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="font-heading text-2xl font-bold">
              {title}
            </CardTitle>
            <Badge variant="outline" className="text-xs uppercase font-semibold">
              {expectedRole}
            </Badge>
          </div>
          <CardDescription className="text-sm mt-1">
            Role-protected portal landing page (temporary testing preview)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Session Status:</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                Active Session
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Signed in as:</span>
              <span className="font-semibold text-foreground">
                {isLoading ? "Loading..." : user?.name || "Authenticated User"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Email:</span>
              <span className="font-mono text-xs text-muted-foreground">
                {user?.email || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Assigned Role:</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {role || expectedRole}
              </Badge>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="destructive"
              size="lg"
              onClick={logout}
              className="w-full font-semibold shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
              <LogOut className="size-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
