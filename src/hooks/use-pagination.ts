"use client";

import * as React from "react";
import { useUrlState } from "./use-url-state";
import type { PaginationMeta } from "@/types/api";

export type PageItem = number | "...";

export function usePagination(meta?: Partial<PaginationMeta>) {
  const { getNumberParam, setParam } = useUrlState();

  const urlPage = getNumberParam("page", 1);
  const currentPage = meta?.page ?? urlPage;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const total = meta?.total ?? 0;

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const setPage = React.useCallback(
    (page: number) => {
      const boundedPage = Math.max(1, Math.min(page, totalPages));
      setParam("page", boundedPage, { resetPage: false });
    },
    [setParam, totalPages]
  );

  const nextPage = React.useCallback(() => {
    if (hasNextPage) {
      setPage(currentPage + 1);
    }
  }, [hasNextPage, setPage, currentPage]);

  const prevPage = React.useCallback(() => {
    if (hasPrevPage) {
      setPage(currentPage - 1);
    }
  }, [hasPrevPage, setPage, currentPage]);

  // Generate pagination numbers array with ellipses (e.g., [1, 2, '...', 7, 8])
  const pageNumbers = React.useMemo((): PageItem[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    pageNumbers,
    setPage,
    nextPage,
    prevPage,
  };
}
