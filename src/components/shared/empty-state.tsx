import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "secondary";
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction | React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const renderAction = () => {
    if (!action) return null;

    if (React.isValidElement(action)) {
      return action;
    }

    const config = action as EmptyStateAction;
    const ActionIcon = config.icon;

    if (config.href) {
      return (
        <Link
          href={config.href}
          className={cn(
            buttonVariants({ variant: config.variant || "default" }),
            "shadow-sm transition-all duration-300"
          )}
        >
          {ActionIcon && <ActionIcon className="size-4 mr-2" />}
          {config.label}
        </Link>
      );
    }

    return (
      <Button
        variant={config.variant || "default"}
        onClick={config.onClick}
        className="shadow-sm transition-all duration-300"
      >
        {ActionIcon && <ActionIcon className="size-4 mr-2" />}
        {config.label}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 p-8 text-center backdrop-blur-sm",
        className
      )}
    >
      <div className="relative mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-violet-500/20 border border-primary/20 shadow-inner">
        <Icon className="size-8 text-primary transition-transform duration-300 hover:scale-110" />
      </div>
      <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{renderAction()}</div>}
    </div>
  );
}
