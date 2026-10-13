"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  /**
   * Custom label for mobile card view. If omitted, string header or key is used.
   */
  mobileLabel?: string;
  /**
   * Hide this column in the mobile stacked card view
   */
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  loadingRows?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  loadingRows = 5,
  emptyState,
  className,
}: DataTableProps<T>) {
  // Loading skeleton state
  if (isLoading) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div className="border-b border-border/70 bg-muted/40 p-4">
            <div className="flex items-center gap-4">
              {columns.map((col) => (
                <Skeleton
                  key={`col-skel-${col.key}`}
                  className="h-4 w-24 shrink-0"
                />
              ))}
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {Array.from({ length: loadingRows }).map((_, rIdx) => (
              <div
                key={`skel-row-${rIdx}`}
                className="flex items-center gap-4 p-4"
              >
                {columns.map((col) => (
                  <Skeleton
                    key={`skel-cell-${rIdx}-${col.key}`}
                    className="h-5 w-24"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile card skeletons */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={`m-skel-${i}`}
              className="border border-border/70 bg-card/60 p-4 space-y-3"
            >
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    if (emptyState) {
      return <div className={className}>{emptyState}</div>;
    }
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-border/70 bg-card/40 p-8 text-center text-sm text-muted-foreground",
          className
        )}
      >
        No records found.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Table View (>= md) */}
      <div className="hidden md:block rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b border-border/70 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/50">
            {data.map((item, index) => {
              const rowKey = keyExtractor(item, index);
              const isClickable = Boolean(onRowClick);

              return (
                <TableRow
                  key={rowKey}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors duration-200 border-border/50",
                    isClickable &&
                      "cursor-pointer hover:bg-muted/50 active:bg-muted/70",
                    !isClickable && "hover:bg-muted/20"
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${rowKey}-${column.key}`}
                      className={cn("py-4 text-sm", column.className)}
                    >
                      {column.cell(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Stacked Card View (< md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {data.map((item, index) => {
          const rowKey = keyExtractor(item, index);
          const isClickable = Boolean(onRowClick);

          return (
            <Card
              key={rowKey}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "border border-border/70 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-200",
                isClickable &&
                  "cursor-pointer hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
              )}
            >
              <CardContent className="p-4 space-y-3">
                {columns
                  .filter((col) => !col.hideOnMobile)
                  .map((column) => {
                    const label =
                      column.mobileLabel ||
                      (typeof column.header === "string" ? column.header : column.key);

                    return (
                      <div
                        key={`m-${rowKey}-${column.key}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="text-xs font-medium text-muted-foreground shrink-0">
                          {label}
                        </span>
                        <div className={cn("text-right font-medium", column.className)}>
                          {column.cell(item, index)}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
