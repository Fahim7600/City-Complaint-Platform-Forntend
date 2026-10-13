import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 pb-6 pt-1", className)}>
      {breadcrumb && (
        <div className="text-xs font-medium text-muted-foreground mb-1">
          {breadcrumb}
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {typeof title === "string" ? (
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
          ) : (
            title
          )}
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
