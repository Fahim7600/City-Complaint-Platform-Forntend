"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Calendar, Crown, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";
import type { User as UserType } from "@/types/user";

interface AccountSummaryCardProps {
  user: UserType;
}

export function AccountSummaryCard({ user }: AccountSummaryCardProps) {
  const isCitizen = user.role === "CITIZEN";
  const departmentName = user.department?.name || (user.departmentId ? "Department Staff" : "Municipal Operations");

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
          Account Status
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Account Role */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              Assigned Role
            </span>
            <div className="pt-0.5">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wide">
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Member Since
            </span>
            <p className="text-xs font-semibold text-foreground pt-0.5">
              {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Citizen: Subscription Plan | Staff/Manager: Department */}
          {isCitizen ? (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Crown className="size-3.5 text-amber-500" />
                Membership Plan
              </span>
              <div className="flex items-center gap-2 pt-0.5">
                {user.isPremium ? (
                  <Badge
                    variant="outline"
                    className="border-amber-400/40 bg-amber-400/10 text-amber-500 font-semibold text-xs gap-1"
                  >
                    <Crown className="size-3 fill-amber-500 text-amber-500" />
                    Premium Citizen
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Free Tier
                    </Badge>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
                    >
                      Upgrade <ArrowUpRight className="size-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-violet-500" />
                Assigned Department
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Badge
                  variant="outline"
                  className="border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold text-xs"
                >
                  {departmentName}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
