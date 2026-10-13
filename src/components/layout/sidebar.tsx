"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  LogOut,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore } from "@/store/ui-store";
import { ROLE_NAVIGATION, type NavItem } from "@/lib/nav-config";
import type { Role } from "@/types/user";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role?: Role | null;
  className?: string;
  onNavigate?: () => void; // Used by mobile sheet to close on item click
  isMobile?: boolean;
}

export function Sidebar({
  role,
  className,
  onNavigate,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, role: authRole, logout } = useAuth();
  const effectiveRole = role || authRole || "CITIZEN";
  const navItems = ROLE_NAVIGATION[effectiveRole] || [];

  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const isCollapsed = isMobile ? false : sidebarCollapsed;

  const isPremiumCitizen =
    effectiveRole === "CITIZEN" && Boolean(user?.isPremium);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CF";

  const getRoleDisplayName = (r: Role) => {
    switch (r) {
      case "CITIZEN":
        return "Citizen Portal";
      case "TECHNICIAN":
        return "Field Technician";
      case "MANAGER":
        return "Dept Manager";
      case "ADMIN":
        return "Administrator";
      default:
        return "Portal";
    }
  };

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <TooltipProvider delay={100}>
      <aside
        className={cn(
          "relative flex flex-col h-full border-r border-border/70 bg-card/70 backdrop-blur-xl transition-[width] duration-300 ease-in-out select-none",
          isCollapsed ? "w-20" : "w-64",
          className
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border/60 shrink-0">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-teal-500 to-violet-500 shadow-md shadow-primary/20 text-white font-bold transition-transform duration-300 group-hover:scale-105">
              <Building2 className="size-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-heading text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  CityFix
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-widest bg-primary/10 px-1.5 py-0.2 rounded">
                    Gov
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {getRoleDisplayName(effectiveRole)}
                </span>
              </div>
            )}
          </Link>

          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "size-8 rounded-lg text-muted-foreground hover:text-foreground transition-transform duration-300",
                isCollapsed && "mx-auto"
              )}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation items */}
        <nav
          role="navigation"
          aria-label="Main sidebar navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin"
        >
          {navItems.map((item) => {
            const active = isItemActive(item);
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 outline-none",
                  active
                    ? [
                        "bg-violet-500/10 text-violet-600 dark:text-violet-300 font-semibold shadow-[inset_0_0_12px_rgba(168,85,247,0.06)]",
                        "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-violet-500 before:shadow-[0_0_12px_rgba(168,85,247,0.8)]",
                      ]
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-300",
                    active
                      ? "text-violet-600 dark:text-violet-400 scale-110"
                      : "text-muted-foreground group-hover:scale-105"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] px-1.5 py-0 border-primary/30 bg-primary/10 text-primary font-bold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger render={linkContent} />
                  <TooltipContent side="right" sideOffset={12}>
                    <p className="font-medium">{item.label}</p>
                    {item.badge && (
                      <span className="text-[10px] text-primary block">
                        {item.badge}
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </nav>

        {/* Bottom User mini-card & Logout */}
        <div className="p-3 border-t border-border/60 space-y-3 shrink-0 bg-muted/20">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-card/60 border border-border/60">
              <Avatar className="size-9 border border-border/80">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {user?.name || "Account User"}
                  </span>
                  {isPremiumCitizen && (
                    <span
                      title="Premium Citizen"
                      className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-500 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                    >
                      <Crown className="size-2.5" />
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground capitalize">
                  {effectiveRole.toLowerCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Avatar className="size-9 border border-border/80 cursor-pointer">
                      <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  }
                />
                <TooltipContent side="right" sideOffset={12}>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-xs">{user?.name || "Account"}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">
                      {effectiveRole.toLowerCase()}
                    </p>
                    {isPremiumCitizen && (
                      <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                        <Sparkles className="size-3" /> Premium Citizen
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Logout Button (variant="destructive") */}
          {!isCollapsed ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="w-full justify-center font-medium shadow-sm transition-all duration-300"
            >
              <LogOut className="size-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={logout}
                    className="w-full size-9 rounded-xl justify-center shadow-sm"
                    aria-label="Sign Out"
                  >
                    <LogOut className="size-4" />
                  </Button>
                }
              />
              <TooltipContent side="right" sideOffset={12}>
                <p className="font-medium text-destructive-foreground">Sign Out</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
