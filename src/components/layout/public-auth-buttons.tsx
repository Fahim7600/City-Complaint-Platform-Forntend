"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME } from "@/lib/roles";

const emptySubscribe = () => () => {};

export function PublicAuthButtons({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleLogout = async () => {
    await logout();
    if (onNavigate) onNavigate();
    router.push("/login");
  };

  // Prevent hydration mismatch between server-rendered placeholder and client auth state
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 rounded-xl bg-muted/60 animate-pulse" />
        <div className="h-9 w-24 rounded-xl bg-muted/60 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2.5">
        <Link href="/login" onClick={onNavigate}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            Sign in
          </Button>
        </Link>
        <Link href="/register" onClick={onNavigate}>
          <Button
            size="sm"
            className="text-xs font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Get started
          </Button>
        </Link>
      </div>
    );
  }

  const effectiveRole = role || user.role || "CITIZEN";
  const isMustChange = Boolean(user.mustChangePassword);
  const dashboardHref = isMustChange
    ? "/set-password"
    : ROLE_HOME[effectiveRole] || "/dashboard";
  const profileHref = `${dashboardHref}/profile`;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CF";

  return (
    <div className="flex items-center gap-3">
      <Link href={dashboardHref} onClick={onNavigate}>
        <Button
          size="sm"
          className="text-xs font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/25 hover:shadow-lg hover:shadow-teal-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-1.5"
        >
          <LayoutDashboard className="size-3.5" />
          <span>{isMustChange ? "Set password" : "Go to dashboard"}</span>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="relative size-9 rounded-full ring-2 ring-violet-500/30 hover:ring-violet-500/60 transition-all p-0"
              aria-label="User account menu"
            >
              <Avatar className="size-9">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-indigo-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56 p-1.5">
          <DropdownMenuLabel className="font-normal px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold leading-none text-foreground truncate max-w-[140px]">
                  {user.name}
                </p>
                <Badge
                  variant="outline"
                  className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0 border-violet-500/40 text-violet-600 dark:text-violet-400"
                >
                  {effectiveRole}
                </Badge>
              </div>
              <p className="text-[11px] leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (onNavigate) onNavigate();
              router.push(dashboardHref);
            }}
            className="text-xs cursor-pointer gap-2"
          >
            <LayoutDashboard className="size-3.5 text-muted-foreground" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (onNavigate) onNavigate();
              router.push(profileHref);
            }}
            className="text-xs cursor-pointer gap-2"
          >
            <User className="size-3.5 text-muted-foreground" />
            <span>Account Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-xs cursor-pointer gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-500/10 dark:focus:bg-rose-500/20"
          >
            <LogOut className="size-3.5" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
