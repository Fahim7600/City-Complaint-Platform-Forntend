"use client";

import * as React from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Crown,
  GraduationCap,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserCog,
  UserX,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";
import type { User } from "@/types/user";

interface UserDetailSheetProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeRole: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
  isSelf: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  MANAGER: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  TECHNICIAN: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  CITIZEN: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

export function UserDetailSheet({
  user,
  open,
  onOpenChange,
  onChangeRole,
  onDeactivate,
  onReactivate,
  isSelf,
}: UserDetailSheetProps) {
  if (!user) return null;

  const isDeactivated = Boolean(user.deletedAt);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md h-full overflow-y-auto p-6 space-y-6"
      >
        <SheetHeader className="text-left space-y-3 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="size-14 rounded-2xl border border-border/70 shadow-sm">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback className="rounded-2xl bg-violet-500/15 text-violet-600 font-bold text-base">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 min-w-0">
              <SheetTitle className="text-lg font-bold text-foreground truncate">
                {user.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground truncate">
                {user.email}
              </SheetDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge
              className={`text-[11px] font-semibold border ${
                ROLE_COLORS[user.role] || "bg-muted text-muted-foreground"
              }`}
            >
              <Shield className="size-3 mr-1" />
              {user.role}
            </Badge>

            {user.isPremium && (
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
                <Crown className="size-3 mr-1 text-amber-500" />
                Premium Citizen
              </Badge>
            )}

            {isDeactivated ? (
              <Badge
                variant="outline"
                className="bg-muted text-muted-foreground border-border text-[11px] font-semibold"
              >
                <UserX className="size-3 mr-1 text-rose-500" />
                Deactivated
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                <CheckCircle2 className="size-3 mr-1" />
                Active Account
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Profile Info Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Account Specifications
          </h4>

          <div className="p-3.5 rounded-xl border border-border/60 bg-card/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" /> Email address
              </span>
              <span className="font-semibold text-foreground">{user.email}</span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5" /> Phone number
              </span>
              <span className="font-semibold text-foreground">
                {user.phone || "Not registered"}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" /> Assigned department
              </span>
              <span className="font-semibold text-foreground">
                {user.department?.name || "None / General"}
              </span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Joined platform
              </span>
              <span className="font-semibold text-foreground">
                {formatDate(user.createdAt)}
              </span>
            </div>

            {user.role === "TECHNICIAN" && (
              <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/40">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-teal-500" /> Duty status
                </span>
                <span className="font-semibold text-foreground">
                  {user.isAvailable ? "Available for dispatch" : "On leave"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Staff Application / Credentials section if available */}
        {(user.experience || user.qualification || user.requestedRole) && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Staff Credentials
            </h4>

            <div className="p-3.5 rounded-xl border border-border/60 bg-card/50 space-y-2.5 text-xs">
              {user.requestedRole && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Applied Role:</span>
                  <span className="font-bold text-foreground">
                    {user.requestedRole} ({user.approvalStatus || "PENDING"})
                  </span>
                </div>
              )}

              {user.experience && (
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="size-3.5" /> Experience:
                  </span>
                  <p className="text-foreground pl-5 whitespace-pre-line">
                    {user.experience}
                  </p>
                </div>
              )}

              {user.qualification && (
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="size-3.5" /> Qualifications:
                  </span>
                  <p className="text-foreground pl-5 whitespace-pre-line">
                    {user.qualification}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Row Actions */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Management Controls
          </h4>

          {isSelf ? (
            <div className="p-3 rounded-xl border border-violet-500/30 bg-violet-500/5 text-xs text-muted-foreground text-center">
              You are viewing your own administrator account. Role modification
              and self-deactivation are disabled for platform safety.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Change role */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onChangeRole(user)}
                className="w-full justify-start text-xs font-semibold border-violet-500/40 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
              >
                <UserCog className="size-3.5 mr-2" />
                Change role & department
              </Button>

              {/* Deactivate or Reactivate */}
              {isDeactivated ? (
                <Button
                  size="sm"
                  onClick={() => onReactivate(user)}
                  className="w-full justify-start text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm shadow-teal-500/20"
                >
                  <CheckCircle2 className="size-3.5 mr-2" />
                  Reactivate user account
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeactivate(user)}
                  className="w-full justify-start text-xs font-semibold shadow-sm"
                >
                  <XCircle className="size-3.5 mr-2" />
                  Deactivate user account
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
