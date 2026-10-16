"use client";

import * as React from "react";
import {
  Building2,
  CheckCircle2,
  Crown,
  Eye,
  MoreHorizontal,
  Send,
  Shield,
  UserCog,
  UserX,
  XCircle,
} from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/shared/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format-date";
import type { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  currentUserId?: string;
  onSelectUser: (user: User) => void;
  onChangeRole: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
  onResendInvite?: (user: User) => void;
  emptyState?: React.ReactNode;
}

const ROLE_BADGES: Record<string, string> = {
  ADMIN: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  MANAGER: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  TECHNICIAN: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  CITIZEN: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

export function UsersTable({
  users,
  isLoading,
  currentUserId,
  onSelectUser,
  onChangeRole,
  onDeactivate,
  onReactivate,
  onResendInvite,
  emptyState,
}: UsersTableProps) {
  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        key: "user",
        header: "User Profile",
        cell: (user) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-xl border border-border/70 shrink-0">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
              <AvatarFallback className="rounded-xl bg-violet-500/15 text-violet-600 font-bold text-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground truncate block text-xs">
                  {user.name}
                </span>
                {user.id === currentUserId && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0 border-violet-500/40 text-violet-500">
                    You
                  </Badge>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground truncate block">
                {user.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        cell: (user) => (
          <Badge
            className={`text-[10px] font-semibold border ${
              ROLE_BADGES[user.role] || "bg-muted text-muted-foreground"
            }`}
          >
            <Shield className="size-2.5 mr-1" />
            {user.role}
          </Badge>
        ),
      },
      {
        key: "department",
        header: "Department",
        cell: (user) =>
          user.department?.name ? (
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Building2 className="size-3 text-muted-foreground" />
              {user.department.name}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground font-mono">—</span>
          ),
      },
      {
        key: "premium",
        header: "Plan",
        cell: (user) =>
          user.isPremium ? (
            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
              <Crown className="size-2.5 mr-1 text-amber-500" />
              Premium
            </Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground">Standard</span>
          ),
      },
      {
        key: "status",
        header: "Status",
        cell: (user) => {
          const isDeactivated = Boolean(user.deletedAt);
          return (
            <div className="flex flex-col gap-1 items-start">
              {isDeactivated ? (
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground border-border text-[10px] font-semibold"
                >
                  <UserX className="size-2.5 mr-1 text-rose-500" />
                  Deactivated
                </Badge>
              ) : (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  <CheckCircle2 className="size-2.5 mr-1" />
                  Active
                </Badge>
              )}
              {user.mustChangePassword && (
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold"
                >
                  Invite pending
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        key: "createdAt",
        header: "Joined",
        cell: (user) => (
          <span className="text-[11px] text-muted-foreground">
            {formatDate(user.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "text-right w-12",
        cell: (user) => {
          const isSelf = user.id === currentUserId;
          const isDeactivated = Boolean(user.deletedAt);

          return (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex justify-end"
            >
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/80"
                    >
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuLabel className="text-[11px]">
                    User Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* View Details */}
                  <DropdownMenuItem
                    onClick={() => onSelectUser(user)}
                    className="text-xs cursor-pointer"
                  >
                    <Eye className="size-3.5 mr-2 text-muted-foreground" />
                    View Profile Sheet
                  </DropdownMenuItem>

                  {!isSelf && (
                    <>
                      {/* Change Role */}
                      <DropdownMenuItem
                        onClick={() => onChangeRole(user)}
                        className="text-xs cursor-pointer"
                      >
                        <UserCog className="size-3.5 mr-2 text-violet-500" />
                        Change Role
                      </DropdownMenuItem>

                      {/* Resend Invite for pending users */}
                      {onResendInvite && user.mustChangePassword && (
                        <DropdownMenuItem
                          onClick={() => onResendInvite(user)}
                          className="text-xs text-amber-600 dark:text-amber-400 cursor-pointer"
                        >
                          <Send className="size-3.5 mr-2 text-amber-500" />
                          Resend Invite
                        </DropdownMenuItem>
                      )}

                      {/* Deactivate / Reactivate */}
                      {isDeactivated ? (
                        <DropdownMenuItem
                          onClick={() => onReactivate(user)}
                          className="text-xs text-teal-600 dark:text-teal-400 cursor-pointer"
                        >
                          <CheckCircle2 className="size-3.5 mr-2 text-teal-500" />
                          Reactivate Account
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onDeactivate(user)}
                          className="text-xs text-destructive cursor-pointer"
                        >
                          <XCircle className="size-3.5 mr-2 text-destructive" />
                          Deactivate Account
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [
      currentUserId,
      onChangeRole,
      onDeactivate,
      onReactivate,
      onResendInvite,
      onSelectUser,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      keyExtractor={(item) => item.id}
      onRowClick={onSelectUser}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}
