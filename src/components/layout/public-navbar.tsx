"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PublicAuthButtons } from "./public-auth-buttons";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function PublicNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-xl shadow-lg shadow-black/5"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-indigo-600 text-white shadow-md shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
            <Sparkles className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
              {siteConfig.name}
            </span>
            <span className="text-[10px] -mt-1 font-medium text-muted-foreground hidden sm:inline">
              Civic Operations
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {siteConfig.links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 group ${
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {/* Neon violet underline indicator */}
                <span
                  className={`absolute inset-x-2.5 -bottom-1 h-0.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-teal-400 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] opacity-100"
                      : "bg-violet-500/50 opacity-0 group-hover:opacity-100 group-hover:scale-x-100 scale-x-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side: ThemeToggle & Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <div className="h-4 w-px bg-border/60" />
          <PublicAuthButtons />
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl text-foreground hover:bg-muted"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm border-l border-border/80 bg-background/95 backdrop-blur-2xl flex flex-col justify-between p-6"
            >
              <div className="space-y-6">
                <SheetHeader className="text-left space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-sm">
                      <Sparkles className="size-4" />
                    </div>
                    <SheetTitle className="font-heading font-extrabold text-base text-foreground">
                      {siteConfig.name}
                    </SheetTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {siteConfig.tagline}
                  </p>
                </SheetHeader>

                <nav className="flex flex-col space-y-1 pt-2">
                  {siteConfig.links.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold border border-violet-500/20 shadow-sm"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && (
                          <span className="size-1.5 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Auth Actions */}
              <div className="pt-6 border-t border-border/60">
                <PublicAuthButtons onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
