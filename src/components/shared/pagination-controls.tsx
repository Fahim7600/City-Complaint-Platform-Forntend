"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/use-pagination";
import type { PaginationMeta } from "@/types/api";
import { cn } from "@/lib/utils";

export interface PaginationControlsProps {
  meta?: Partial<PaginationMeta>;
  className?: string;
  showTotal?: boolean;
}

export function PaginationControls({
  meta,
  className,
  showTotal = true,
}: PaginationControlsProps) {
  const {
    currentPage,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    pageNumbers,
    setPage,
    nextPage,
    prevPage,
  } = usePagination(meta);

  // If there's 1 or 0 pages, do not show controls unless total count is desired
  if (totalPages <= 1 && total === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2",
        className
      )}
    >
      {showTotal && (
        <div className="text-xs text-muted-foreground order-2 sm:order-1">
          {total > 0 ? (
            <>
              Showing page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages}</span> ({total} total results)
            </>
          ) : (
            <>
              Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{totalPages}</span>
            </>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          role="navigation"
          aria-label="Pagination"
          className="flex items-center gap-1 order-1 sm:order-2"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!hasPrevPage}
            className="h-8 px-2.5 gap-1 text-xs border-border/70 bg-card/60"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="size-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="flex size-8 items-center justify-center text-muted-foreground text-xs"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </span>
                );
              }

              const isCurrent = p === currentPage;
              return (
                <Button
                  key={`page-${p}`}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "size-8 p-0 text-xs transition-all duration-200",
                    isCurrent
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/30"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!hasNextPage}
            className="h-8 px-2.5 gap-1 text-xs border-border/70 bg-card/60"
            aria-label="Go to next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </nav>
      )}
    </div>
  );
}
