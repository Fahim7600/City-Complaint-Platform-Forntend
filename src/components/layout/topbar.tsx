"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, LogOut, ChevronRight, Crown } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/user";

interface TopbarProps {
  role?: Role | null;
  title?: string;
  breadcrumb?: React.ReactNode;
}

function getPathBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Home", href: "/" }];

  const crumbs: { label: string; href?: string }[] = [];
  let currentPath = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    currentPath += `/${part}`;
    const formatted = part
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    crumbs.push({
      label: formatted,
      href: i === parts.length - 1 ? undefined : currentPath,
    });
  }

  return crumbs;
}

export function Topbar({ role, title, breadcrumb }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role: authRole, logout } = useAuth();
  const effectiveRole = role || authRole || "CITIZEN";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close mobile drawer when route changes
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "CF";

  const getProfileHref = () => {
    switch (effectiveRole) {
      case "CITIZEN":
        return "/dashboard/profile";
      case "TECHNICIAN":
        return "/technician/profile";
      case "MANAGER":
        return "/manager/profile";
      default:
        return "/notifications";
    }
  };

  const breadcrumbs = getPathBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Hamburger (< lg) & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Sheet */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl text-muted-foreground hover:text-foreground"
                  aria-label="Open mobile navigation"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-72 bg-card border-r border-border/70">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Sidebar
                role={effectiveRole}
                isMobile={true}
                onNavigate={() => setMobileMenuOpen(false)}
                className="w-full h-full border-r-0"
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Breadcrumb or Title */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
          {breadcrumb ? (
            breadcrumb
          ) : title ? (
            <span className="font-heading text-sm font-semibold text-foreground truncate">
              {title}
            </span>
          ) : (
            <div className="flex items-center gap-1.5 truncate">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {idx > 0 && (
                      <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                    )}
                    {isLast ? (
                      <span className="font-semibold text-foreground truncate max-w-[200px]">
                        {crumb.label}
                      </span>
                    ) : (
                      <span className="truncate max-w-[120px] hidden sm:inline">
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right side: NotificationBell, ThemeToggle, User Avatar Dropdown */}
      <div className="flex items-center gap-2 shrink-0">
        <NotificationBell />
        <ThemeToggle />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9 rounded-full ring-2 ring-transparent hover:ring-primary/40 transition-all duration-200"
                aria-label="User profile menu"
              >
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />

          <DropdownMenuContent
            align="end"
            className="w-56 p-1 border border-border/80 bg-background/95 backdrop-blur-md shadow-xl rounded-xl"
          >
            <DropdownMenuLabel className="p-3 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
                  {user?.name || "User Account"}
                  {user?.isPremium && (
                    <Crown className="size-3 text-amber-500 shrink-0" />
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate font-mono">
                  {user?.email || "user@cityfix.gov"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push(getProfileHref())}
              className="cursor-pointer flex items-center gap-2"
            >
              <User className="size-4 text-muted-foreground" />
              <span>My Profile</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout button in red */}
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium"
            >
              <LogOut className="size-4 mr-2 text-destructive" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
