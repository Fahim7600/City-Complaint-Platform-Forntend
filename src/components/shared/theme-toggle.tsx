"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  
  // React 19 idiomatic hydration-safe client mounting check
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme placeholder"
        className={cn("relative overflow-hidden", className)}
      >
        <span className="size-4 opacity-0" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("relative overflow-hidden", className)}
    >
      <Sun className="size-4.5 text-amber-500 transition-all duration-500 ease-out rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4.5 text-violet-400 transition-all duration-500 ease-out rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
